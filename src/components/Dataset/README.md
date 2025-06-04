# Dataset

## Dataset
Le composant `Dataset` permet de définir des jeux de données qui seront utilisés par
les graphiques.
Ils peuvent avoir un `Transform` en enfant pour modifier localement le jeu de données fourni par l'API.


TODO : supporter plusieurs `Transform` successifs.

## Transform

Le composant `Transform` est optionnel. Il modifie les données du `Dataset` parent. 
Il doit contenir la fonction javascript qui traite les données.

## Exemple

```jsx
<Dashboard>
    <Dataset
    id="monIdentifiantUnique"
    provider={ademe_opendataProvider}
    resource="sinoe-(r)-destination-des-dma-collectes-par-type-de-traitement/lines"
    >
      <Transform>
        {(data) => data.filter((e) => e.TONNAGE_DMA > 3000)}
      </Transform>
    </Dataset>
  {/* [...] */}
</Dashboard>
```