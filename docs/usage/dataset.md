# Données

La première étape dans la réalisation du tableau de bord consiste à définir les données qui seront utilisés.
La biblithièque supporte de manière standard différents [fournisseurs](https://github.com/geo2france/api-dashboard/tree/main/src/data_providers).
Certaines opérations sont génériques (`<Filter>`), alors que d'autres exploitent des capacités 
spécifiques à un fournisseur (propriété _meta_ de `<Dataset>`).


## Source de données

### Connecter une source

Le composant `Dataset` permet de définir des jeux de données qui seront utilisés par
les graphiques.
On peut également ajouter des métadonnées (producteurs), qui s'afficheront sous les graphiques utilisant ce dataset.

```jsx
<Dashboard>
    <Dataset
    id="monIdentifiantUnique"
    url="https://data.ademe.fr/data-fair/api/v1/datasets"
    type='datafair'    resource="sinoe-(r)-destination-des-dma-collectes-par-type-de-traitement/lines"
    >
      <Producer url="https://www.sinoe.org">Ademe</Producer>
      <Producer url="https://odema-hautsdefrance.org/">Odema</Producer>
    </Dataset>
  {/* [...] */}
</Dashboard>
```

### Filter les données

Il s'agit de filtres **envoyés à l'API du fournisseur de données**.
Il utilise des opérateurs standards (`eq`, `ne`, `contains`, etc.) qui sont ensuite automatiquement 
traduits dans le format attendu par le fournisseur de données. Voir la [liste des opérateur](https://github.com/geo2france/api-dashboard/blob/b9c1ddb511f6bf722704b4935160eacdcfe33cc2/src/data_providers/types.ts#L23-L45). Attention, les fournisseurs ne supportent pas toujours tous les opérateurs.

```jsx
<Filter field='L_REGION'>Hauts-de-France</Filter> // operateur eq (égalité) par défaut
<Filter field='L_TYP_REG_DECHET' operator='ne'>Encombrants</Filter>
```

### Fournisseurs diposnibles

- WFS 1.1
- DataFair
- Fichier

## Manipuler les données

### Transform

Le composant enfant `<Transform>` est optionnel. Il permet de **modifier localement** les données du `<Dataset>` parent. 
Il doit contenir soit :

- Une **fonction javascript** qui traite les données.
- Une **requête SQL** (chaîne de caractères) (voir la [documentation Alasql](https://github.com/AlaSQL/alasql/wiki/Select)).

Si plusieurs `<Transform>` sont ajoutés, ils sont appliqués successivement sur les données.
Cette opération est effectuée côté client, et **ne modifie donc pas l'appel à l'API**.

```jsx
<Dashboard>
    <Dataset
    id="dma_par_type_de_traitement"
    url="https://data.ademe.fr/data-fair/api/v1/datasets"
    type='datafair'
    resource="sinoe-(r)-destination-des-dma-collectes-par-type-de-traitement/lines"
    >
      <Transform>{(data) => data.filter((e) => e.TONNAGE_DMA > 3000)}</Transform>
      <Transform>SELECT * FROM ? ORDER BY [TONNAGE_DMA] DESC LIMIT 5</Transform>
    </Dataset>
  {/* [...] */}
</Dashboard>
```

### Join

`Join` permet de faire une jointure avec un autre jeu de données. 
L'ordre avec les composants `Transform` est respecté. Ainsi, un `Transform` placé **après** une jointure
s'appliquera sur le produit de la jointure.

- `dataset` : identifiant du dataset à joindre (= table de droite)
- `joinKey` : un tableau avec les champs à joindre (ex : `['leftKey','RightKey]`)
- `joinType` : type de jointure  `right` | `left` | `full` | `inner` (défaut `inner`)

```jsx
<Dashboard>
      <Dataset
        id="ref_epci_odema"
        resource='odema:territoire_epci'
        url='https://www.geo2france.fr/geoserver/ows'
        type='wfs'
        pageSize={1000}
      >
         <Filter field='annee'>{useControl('annee')}</Filter>
      </Dataset>

      <Dataset 
        id="sinoe_synthese_indic" 
        resource='sinoe59-indic-synth-acteur/lines'
        url="https://data.ademe.fr/data-fair/api/v1/datasets"
        type='datafair'
        pageSize={5000}>
            <Filter field='l_region'>Hauts-de-France</Filter>
            <Filter field='annee'>{useControl('annee')}</Filter>
            <Join dataset="ref_epci_odema" joinKey={["c_acteur","c_acteur_sinoe" ]} />
            <Transform>SELECT c_acteur, name_short as nom, tonnage_omr, tonnage_bio FROM ?</Transform>
      </Dataset>
</Dashboard>
```



## Performances et eco-conception 🌱

La bibliothèque va systématiquement éviter de lancer plusieurs fois la même requête.
Il est donc important de différencier les opérations s'appliquant côté fournisseur de données de celles effectuées par le client.

### Provider WFS

Le WFS permet d'alléger les requêtes en ne demandant que les champs nécessaire (https://docs.geoserver.org/main/en/user/services/wfs/reference.html#getfeature).
Cette fonctionnalité (non standard entre les différents fournisseurs), peut être utilisée en utilisant la propriété _meta_ de `<Dataset>`.

Idéalement, on utilisera la même propriété meta pour les dataset lié au même fournisseur, afin de réduire le nombre de requête sur le serveur.

```jsx
<Dataset
  id="epci_hdf_pop"
  resource="spld:epci"
  url='https://www.geo2france.fr/geoserver/ows'
  type='wfs'
  pageSize={1000}
  meta={{properties:['nature_epci', 'pop_mun', 'nom_epci']}} >
  
</Dataset>
```


## DataPreview

Un tableau simple pour visualiser les données du dataset. Il s'agit d'un composant utilisable pour faciliter la conception 🔧 du tableau de bord.
La clé `rowKey` (colonne qui contient une clé unique) du tableau est optionnelle, mais améliore les performances sur des gros datasets.


```jsx
<Dashboard>
    <Dataset
    id="monIdentifiantUnique"
    url="https://data.ademe.fr/data-fair/api/v1/datasets"
    type='datafair'    
    resource="sinoe-(r)-destination-des-dma-collectes-par-type-de-traitement/lines"
    />

    <DataPreview dataset_id='myuniquedatasetid' pageSize={5} rowKey='_i'/>

  {/* [...] */}
</Dashboard>
```

