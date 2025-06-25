# Dataset

La première étape dans la réalisation du tableau de bord et de définir les données qui seront utilisés.
La biblithièque supporte de manière standard différents [fournisseurs](https://github.com/geo2france/api-dashboard/tree/main/src/data_providers).
Certaines opérations sont génériques (`<Filter>`), alors que d'autres exploitent des capacités 
spécifiques à un fournisseur (propriété _meta_ de `<Dataset>`).


## Dataset
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


## Transform

Le composant enfant `Transform` est optionnel. Il permet de modifier localement les données du `Dataset` parent. 
Il doit contenir soit :
- Une fonction javascript qui traite les données.
- Une chaîne de caractères qui sera interprétée comme une requête SQL (voir la [documentation Alasql](https://github.com/AlaSQL/alasql/wiki/Select)).

Si plusieurs `Transform` sont ajoutés, ils sont appliqués successivement sur les données.
Cette opération est effectués côté client, et **ne modifient donc pas la requête**.

```jsx
<Dashboard>
    <Dataset
    id="monIdentifiantUnique"
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

```jsx
<Dashboard>
    <Dataset
    id="monIdentifiantUnique"
    url="https://data.ademe.fr/data-fair/api/v1/datasets"
    type='datafair'
    resource="sinoe-(r)-destination-des-dma-collectes-par-type-de-traitement/lines"
    >
      <Transform>SELECT [ANNEE] as [annee] FROM ? ORDER BY [ANNEE] DESC LIMIT 1</Transform>
    </Dataset>
  {/* [...] */}
</Dashboard>
```

## Filter

Il s'agit de filtres envoyés à l'API du fournisseur de données.
Il utilise des opérateurs standards (`eq`, `ne`, `contains`, etc.) qui sont ensuite automatiquement 
traduits dans le format attendu par le fournisseur de données. Voir la [liste des opérateur](https://github.com/geo2france/api-dashboard/blob/b9c1ddb511f6bf722704b4935160eacdcfe33cc2/src/data_providers/types.ts#L23-L45). Attention, les fournisseurs ne supportent pas toujours tous les opérateurs.

```jsx
<Filter field='L_REGION'>Hauts-de-France</Filter> // operateur eq (égalité) par défaut
<Filter field='L_TYP_REG_DECHET' operator='ne'>Encombrants</Filter>
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
   meta={{properties:['nature_epci', 'pop_mun', 'nom_epci']}}
 >
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

