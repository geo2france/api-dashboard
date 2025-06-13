# Dataset

## Dataset
Le composant `Dataset` permet de définir des jeux de données qui seront utilisés par
les graphiques.
On peut également ajouter des métadonnées (producteurs), qui s'afficheront sous les graphiques utilisant ce dataset.

```jsx
<Dashboard>
    <Dataset
    id="monIdentifiantUnique"
    provider={ademe_opendataProvider}
    resource="sinoe-(r)-destination-des-dma-collectes-par-type-de-traitement/lines"
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

```jsx
<Dashboard>
    <Dataset
    id="monIdentifiantUnique"
    provider={ademe_opendataProvider}
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
    provider={ademe_opendataProvider}
    resource="sinoe-(r)-destination-des-dma-collectes-par-type-de-traitement/lines"
    >
      <Transform>SELECT [ANNEE] as [annee] FROM ? ORDER BY [ANNEE] DESC LIMIT 1</Transform>
    </Dataset>
  {/* [...] */}
</Dashboard>
```

## DataPreview

Un tableau simple pour visualiser les données du dataset.
La clé `rowKey` du tableau est optionnelle, mais peux améliorer les performances sur des gros datasets.
Il s'agit du nom de la colonne qui contient un identifiant unique pour chaque ligne. Sans clé, l'ensemble des colonnes est utilisée.


```jsx
<Dashboard>
    <Dataset
    id="monIdentifiantUnique"
    provider={ademe_opendataProvider}
    resource="sinoe-(r)-destination-des-dma-collectes-par-type-de-traitement/lines"
    />

    <DataPreview dataset_id='myuniquedatasetid' pageSize={5} rowKey='_i'/>

  {/* [...] */}
</Dashboard>
```
