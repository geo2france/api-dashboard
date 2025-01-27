# API-Dashboard

Collection de composants React pour faciliter la création de **tableaux de bords territoriaux**.

Le projet permet la mise en place d'un tableau de bord facile à déployer sur une **infrastucture légère**.
Le tableau de bord, une fois compilé, peut-être mis à disposition des utilisateurs via un **simple server web** (HTTP/HTTPS) sans configuration particulière.
Il s'agit d'une application React (Javascript) s'executant dans le navigateur des utilisateurs. Il n'y a pas **backend à installer**,
l'application récupère les données via API **auprès d'un partenaire** (plateforme régionale, portail open-data, etc.) ou sur **votre serveur de données**.
Les données sont ensuites traitées par le client et présentées à l'utilisateur via des graphiques ou cartes.

Si des données sensibles alimentent un tableau de bord, l'authentification et la sécurité sont gérées au niveau du serveur de données. C'est donc 
lui qui va s'assurer que l'utilisateur a un droit d'accès aux données. L'application peut donc tout être utilisée pour présenter
des données sensibles ou même des graphiques dont les données diffèrent selon les droits de l'utilisateur.

Les API suivantes sont actuellement supportées (interrogation, filtre, pagination, etc. ) :
- [WFS](src/data_providers/wfs/) : API proposée par la plupart des serveurs geographiques (QGIS Server, GeoServer, ArcGIS server, etc.)
- [Data Fair](src/data_providers/datafair/) : API de la solution open source Data Fair.
- En développement : OGC API Features, TJS

![diag](architecture_1.png)

En bref : 

- ✅ Déploiement facile et rapide (_client side_)
- ✅ Présentez au même endroit des données publiques, vos données et celles de vos partenaires
- ✅ Possibilité de visualiser des données sensibles
- ✅ Personnalisation extrême (développement sur-mesure)



🧑‍💻 Bien que nous fassions le maximum pour proposer des composants prêts à utiliser, la mise en oeuvre de la solution nécessite encore des **connaissances de base
sur le développement d'application React**.

Les composants sont actuellement utilisés pour le [tableau de bord de l'Odema](https://github.com/geo2france/odema-dashboard).


## Installation

Version de développment :
`npm install https://github.com/geo2france/api-dashboard/tarball/dev`

Version stable :
`npm install https://github.com/geo2france/api-dashboard/tarball/main`

## Documentation 

### Composants 

- [DashboardLayout](/src/components/DashboardLayout/) ⭐
- [DashboardElement](/src/components/DashboardElement/) ⭐
- [KeyFigure](/src/components/KeyFigure/) ⭐
- [NextPrevSelect](/src/components/NextPrevSelect/) ⭐
- [MapLegend](/src/components/MapLegend/) ⭐
- [FlipCard](/src/components/FlipCard/)
- [LoadingContainer](/src/components/LoadingContainer/)

### Hooks et fonctions

- [useApi](/src/utils/README.MD) ⭐
- [useChartEvents](/src/utils/README.MD) ⭐
- [useChartActionHightlight](/src/utils/README.MD) ⭐
- [useSearchParamsState](/src/utils/README.MD) ⭐
- [useMapControl](/src/utils/README.MD) ⭐
- [useChartExport](/src/utils/README.MD)

### Fournisseur de données

- [WFS](/src/data_providers/wfs/) ⭐
- [Datafair](/src/data_providers/datafair/) ⭐
