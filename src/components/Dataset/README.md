# Dataset

## Dataset
Le composant `Dataset` permet de définir des jeux de données qui seront utilisés par
les graphiques.


## Transform

Le composant enfant `Transform` est optionnel. Il permet de modifier localement les données du `Dataset` parent. 
Il doit contenir soit :
- Une fonction javascript qui traite les données.
- Une chaîne de caractères qui sera interprétée comme une requête SQL. Voir la [documentation Alasql](https://github.com/AlaSQL/alasql/wiki/Select).

Pour l'instant, un seul `Transform` peut être appliqué. TODO : supporter plusieurs `Transform` successifs.


## Exemple

```jsx
<Dashboard>
    <Dataset
    id="monIdentifiantUnique"
    provider={ademe_opendataProvider}
    resource="sinoe-(r)-destination-des-dma-collectes-par-type-de-traitement/lines"
    >
      <Transform>{(data) => data.filter((e) => e.TONNAGE_DMA > 3000)}</Transform>
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