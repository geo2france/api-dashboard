# wfs-data-provider

Fournisseur **WFS 1.1** compatible QGIS Server et GeoServer.

## Opérateurs supportés
- `ne`
- `gte`
- `gt`
- `lte`
- `lt`
- `eq`
- `contains`
- `startswith`
- `endswith`
- `containss`
- `startswiths`
- `endswiths`
- `ncontains`
- `nstartswith`
- `nendswith`
- `ncontainss`
- `nstartswiths`
- `nendswiths`
- `in`

L'opérateur `in`, appliqué sur la champs `geometry` permet de définir la _bounding box_ de la requête.


## Meta

- `srsname` : specify coordinates systeme (e.g. : `EPSG:2154`)
- `propertyname` : return only given list of properties (e.g. : `['name','annee']`). Useful for avoid fetching large geometries.

See [WFS Reference](https://docs.geoserver.org/latest/en/user/services/wfs/reference.html) for details.

## Exemples de fournisseurs de données

- [Geo2France](https://www.geo2france.fr/datahub/)
- [Métropole Européenne de Lille](https://data.lillemetropole.fr/)
- [DataGrandEst](https://www.datagrandest.fr/data4citizen)