# API-Dashboard

Collection de composants React pour faciliter la création de **tableaux de bords territoriaux**.

Le projet permet la mise en place d'un tableau de bord facile à déployer sur une **infrastucture légère**.
Le tableau de bord, une fois compilé, peut-être mis à disposition des utilisateurs via un **simple server web** (HTTP/HTTPS) sans configuration particulière.
Il s'agit d'une application React (Javascript) s'executant dans le navigateur des utilisateurs. Il n'y a pas **backend à installer**,
l'application récupère les données via API **auprès d'un partenaire** (plateforme régionale, portail open-data, etc.) ou sur **votre serveur de données**.
Les données sont ensuites traitées par le client et présentées à l'utilisateur via des graphiques ou cartes.

Le tableau de bord est construit de manière déclarative **JSX** (accronyme de JavaScript XML).
Comme son nom l'indique, il permet de combiner la clarté et l'efficacité du XML, avec la souplesse et la puissance du JavaScript.

Les API suivantes sont actuellement supportées (interrogation, filtre, pagination, etc. ) :
- [WFS](src/data_providers/wfs/) : API proposée par la plupart des serveurs geographiques (QGIS Server, GeoServer, ArcGIS server, etc.)
- [Data Fair](src/data_providers/datafair/) : API de la solution open source Data Fair.
- En développement : OGC API Features, TJS

![diag](architecture_1.png)

En bref : 

- ✅ Déploiement facile et rapide (_client side_)
- ✅ Présentez au même endroit des données tierces, vos données et celles de vos partenaires
- ✅ Possibilité de visualiser des données sensibles
- ✅ Flexibilité

Les composants sont actuellement utilisés pour le [tableau de bord de l'Odema](https://github.com/geo2france/odema-dashboard).

## Installation

Pour créer un nouveau tableau de bord :

```sh
npm init @geo2france/api-dashboard@latest nom-du-projet
cd nom-du-projet && npm install

# Lancer le serveur de développement
npm run dev
```

Consulter la [documentation](https://geo2france.github.io/api-dashboard/) du projet.

