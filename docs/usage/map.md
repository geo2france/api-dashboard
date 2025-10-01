# Cartographie

![documentation](https://maplibre.org/maplibre-style-spec/layers/#paint)

## Propriétés

| Nom           | Type                      | Requis | Par défaut | Description |
|----------------|---------------------------|--------|------------|-------------|
| `dataset`      | `string`                  | ✳️      | —          | Identifiant du dataset à utiliser. |
| `categoryKey`  | `string`                  |       |          | Nom de la colonne contennant les catégories |
| `title  `     | `string`                  |        |          | Titre de la carte |
| `popup`  | `boolean`                  |        | `false`           | Afficher une popup au clic sur un élement. |
| `title`        | `string`                  |        |           | Titre du graphique. |
| `paint`        | `object`                 |        |     | Pour définir finement le style de la couche. Voir la  [documentation](https://maplibre.org/maplibre-style-spec/layers/#paint) de MapLibre. |
| `color`     | `string`        |        |           | Couleur du symbole (sinon, définit à partir de la palette). Sans effet si `categoryKey` ou  `paint` sont définis.  |
| `type`         | `'bar' \| 'line' \| 'area'` |        | `'line'` | Type de graphique à afficher. |


## Exemple

```tsx
import { Dashboard, Dataset, Filter, Map, Palette, Producer, Transform } from "@geo2france/api-dashboard/dsl"
<Dashboard debug>
    <Palette steps={['#D5C3FB','#5E8C5C','#D4EACA','#F19E38','#745017']}/>
    <Dataset 
        id='scot'
        resource="scot_en_cours"
        url='https://qgisserver.hautsdefrance.fr/cgi-bin/qgis_mapserv.fcgi?MAP=/var/www/data/qgis/applications/limites_admin.qgz'
        type='wfs'
        pageSize={50}
        meta={{srsname:'EPSG:4326'}}
        >
        <Producer url="https://opendata.hautsdefrance.fr/dataset/ee965118-2416-4d48-b07e-bbc696f002c2">Région Hauts-de-France</Producer>
    </Dataset>

    <Map dataset="scot" categoryKey="etat_proc" title="Les SCOT des Hauts-de-France"/>

</Dashboard>

```
