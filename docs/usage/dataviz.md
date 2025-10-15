# Graphiques (dataviz)

La bibliothèque fournie quelques graphiques de base pouvant être utiliser
directement.

Ma sa grande force réside dans le fait de pouvoir créer vos propres graphiques à
partir de n'importe quelle bibliothèque (ECharts, Rechart, Chart.js, D3.js, etc.).

## Graphiques standards

### YearSerie

Adapté aux représentations de valeurs annuelles.


| Nom           | Type                      | Requis | Par défaut | Description |
|----------------|---------------------------|--------|------------|-------------|
| `dataset`      | `string`                  | ✳️      | —          | Identifiant du dataset à utiliser. |
| `yearKey`      | `string`                  | ✳️      | —          | Nom de la colonne contennant l'année. |
| `valueKey`     | `string`                  | ✳️      | —          | Nom de la colonne contenant la valeur numérique |
| `categoryKey`  | `string`                  |        | —          | Colonne pour grouper les données par catégorie (ex : type, secteur...). |
| `title`        | `string`                  |        | —          | Titre du graphique. |
| `stack`        | `boolean`                 |        | `false`    | Empile les séries si plusieurs catégories sont présentes. |
| `yearMark`     | `number \| string`        |        | —          | Année à mettre en évidence (ex : `2021` ou `useControl('annee')` ) |
| `type`         | `'bar' \| 'line' \| 'area'` |        | `'line'` | Type de graphique à afficher. |

![yearserie](yearserie.png)


### Pie

Graphique "camembert".
Si des catégories sont dupliquées, les valeurs de celles-ci sont automatiquement sommées.

| Nom        | Type         | Requis | Par défaut | Description                                                                 |
|------------|--------------|--------|------------|-----------------------------------------------------------------------------|
| `dataset`  | `string`     | ✳️     | —          | Identifiant du dataset à utiliser.                                          |
| `dataKey`  | `string`     | ✳️     | —          | Nom de la colonne contenant les valeurs numériques à représenter.           |
| `nameKey`  | `string`     | ✳️     | —          | Nom de la colonne contenant les catégories (libellés des parts).            |
| `donut`    | `boolean`    |      | `false`    | Affiche le graphique en style **donut** (camembert avec un trou central).   |
| `unit `    | `string `    |      |            | Unité à afficher (ex: _%_, _kg_, etc.)   |
| `title `   | `string `    |      |            | Titre du graphique |
| `other`    | `number | null`|   |  1         | Regrouper les catégories représentant moins de x% dans une catégorie "Autres". `null` pour désactiver | 

![pie screenshot](screenshot_pie.png)

#### Exemple

```jsx
<Dashboard>
    <Dataset 
        id="dma_collecte_traitement" 
        resource='sinoe-(r)-destination-des-dma-collectes-par-type-de-traitement/lines'
        url="https://data.ademe.fr/data-fair/api/v1/datasets"
        type='datafair'
        pageSize={5000}>
        <Filter field='L_REGION'>Hauts-de-France</Filter>
        <Filter field='L_TYP_REG_DECHET' operator='ne'>Encombrants</Filter>
        <Filter field='ANNEE'>{useControl('annee')}</Filter>
        <Transform>SELECT [L_TYP_REG_DECHET], [ANNEE], [C_DEPT], SUM([TONNAGE_DMA]) as [TONNAGE_DMA] FROM ? GROUP BY [ANNEE], [C_DEPT], [L_TYP_REG_DECHET]</Transform>
        <Transform>{(data) => data.map(row=>({pouette:4, ...row}))}</Transform>
        <Producer url="https://www.sinoe.org">Ademe</Producer>
        <Producer url="https://odema-hautsdefrance.org/">Odema</Producer>
    </Dataset>

    <ChartPie 
        // Identifiant du dataset (obligatoire si plusieurs dataset)
        dataset="destination-dma" 
        // Colonne qui contient les valeurs numériques
        dataKey='TONNAGE_DMA' 
        // Colonne qui contient les catégories
        nameKey='L_TYP_REG_DECHET'
        // Variante "donut" (trou central)
        donut 
    />

</Dashboard>
```

### Statistiques

Il s'agit de carte permettant de présenter des chiffres clés. On les regroupera généralement au sein d'un bloc.
Ce composant afficher la **dernière valeur** du dataset, il doit donc être ordonnée.
![Statistics](statistics.png)

| Nom                | Type                                  | Requis | Par défaut | Description                                                                 |
|-------------------|---------------------------------------|--------|------------|-----------------------------------------------------------------------------|
| `dataset`         | `string`                              | ✳️     | —          | Identifiant du jeu de données à utiliser.                                   |
| `dataKey`         | `string`                              | ✳️     | —          | Nom de la colonne contenant les valeurs à afficher.                         |
| `evolutionSuffix` | `string`                              |        | —          | Texte à afficher après l’évolution (ex : "depuis l’an dernier").           |
| `relativeEvolution` | `boolean`                            |        | `false`    | Afficher l'évolution en pourcentage ; sinon dans la même unité que la valeur. |
| `title`           | `string`                              |        | —          | Titre de la carte statistique.                                              |
| `color`           | `string`                              |        | —          | Couleur de la carte.                                   |
| `unit`            | `string`                              |        | —          | Unité de la valeur (ex : kg, %, €).                                        |
| `invertColor`     | `boolean`                             |        | `false`    | Inverse la logique de couleur de l’évolution (rouge/vert).                  |
| `icon`            | `ReactElement | string`              |        | —          | Icône affichée sur la carte (composant ou nom d’icône pour Iconify.js).    |
| `help`            | `string`                              |        | —          | Texte affiché dans la tooltip d’aide.        |
| `compareWith`     | `"first" | "previous"`               |        | —          | Comparer la valeur avec la première valeur ou la valeur précédente. |
| `annotation`        | `ReactNode \| ((param) => ReactNode)` |             | —          | Texte ou élément React affiché comme annotation. Peut être une valeur directe ou une fonction qui retourne un texte ou composant React. Remplace `evolution` si définie. |                                                                     |

#### Annotation et évolution

Si la propriété `annotation` n'est pas définie, c'est l'évolution qui sera affichée sous la valeur.
Il s'agit de l'évolution par rapport à la premiere valeur ou la valeur précédente, selon la propriété `compareWith`.

Avec la propriété `annotation` il est possible d'afficher ce que vous souhaitez sous la valeur principale.
`annotation` peut-être :

- un composant (généralement un texte mis en forme),
- un texte simple,
- une fonction de callback qui retourne un texte ou un composant. (usage avancé)

Lorsque annotation est une fonction, elle reçoit comme paramètre un objet qui permet d’accéder à différentes informations utiles pour générer dynamiquement l’annotation.
L'objet reçu en parmètre a les propriétés suivantes :

 - `value`: valeur courante affichée sur la carte
 - `compare_value` : valeur de comparaison
 - `data` : tableau complet des données du dataset



#### Exemple

```jsx
      <StatisticsCollection title="Chiffres clés">

        <Statistics dataset="capacite_isdnd_region" dataKey="capacite" unit="T" color="orange" 
          icon="material-symbols-light:1x-mobiledata-badge-sharp" compare="first" invertColor relativeEvolution evolutionSuffix="depuis 2010"/>

        <Statistics dataset="capacite_isdnd_region" dataKey="capacite" unit="🎃" color="green" 
          icon="pajamas:discord" compareWith="previous" invertColor relativeEvolution evolutionSuffix="depuis l'année dernière"/>

        <Statistics dataset="capacite_isdnd_region" dataKey="capacite" unit="T" color="purple" 
          icon="pajamas:accessibility" relativeEvolution evolutionSuffix="depuis 2010"/>

        <Statistics 
          dataset="mondataset" dataKey="prix" unit="€" color="yellow" 
           annotation={(p) => <span><b>🤡 {p.value.toLocaleString()} </b> ! Avant c'était plutôt <i>{p.compare_value.toLocaleString()}</i> ! </span>}
        />

    </StatisticsCollection>
```

## Développer vos propres graphiques 🔧

Il est possible d'écrire un composant dont le rendu est un visuel.
N'importe quel bibliothèque peut-être utilisée, ou même du HTML.

### Graphique Echarts

Api-dashboard fourni un composant `<ChartEcharts>` permettant de faciliter la création de graphiques Echarts.

Il suffit de fournir un objet de configuration ECharts via la propriété `options`.
Pour un usage plus avancé, la propriété `ref` permet de récupérer l'instance ECharts (réagir à des évenements, déclencher des actions sur le graphique).



| Propriété        | Type          | Description                                                                 |
|------------|---------------|-----------------------------------------------------------------------------|
| `option `  | `object`      | Objet de configuration ECharts                                         |
| `ref`  | `React.RefAttributes<EChartsReact>`      |   Référence de l'instance ECharts  |


```jsx
import React,  { useRef, useEffect } from "react";
import { ChartEcharts } from "@geo2france/api-dashboard";


export default function MonGraphiqueCustom({}) {

  useBlockConfig({
    title:'Mon super graphique'
  })

  // Optionnel, permet de récuperer l'instance Echarts du graphique
  const chartRef = useRef(null);
  useEffect(() => {
    if (chartRef.current) {
      const mychart = chartRef.current.getEchartsInstance();
      // Cf. https://echarts.apache.org/en/api.html#echartsInstance
      mychart.on('click', (e) => ( console.log('clicked',e) ) );
    }  
  }, [ ]);



  // Cf. https://echarts.apache.org/en/option.html
  const options = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
        }
    ]
  };

  return (
      <ChartEcharts options={options} ref={chartRef} />
  );
}
```

### Icônes

Api-dashboard utilise la bibliothèque [Iconify](https://iconify.design/) pour les icônes.
Iconify étant installé comme dépendance, elle est directement utilisable dans le projet.

De très nombreuses icônes sont disponibles dans le [catalogue](https://icon-sets.iconify.design/) qui aggrège de nombreuses bibliothèques d'icônes.
Le composant `Icon` supporte différentes propriétées permettant de personnaliser le rendu (couleur, dimensions, transformations, etc.). 

Consulter la [documentation officielle](https://iconify.design/docs/icon-components/react/#properties).

```tsx
import { Icon } from '@iconify/react';

<Icon icon="cib:creative-commons" />
```