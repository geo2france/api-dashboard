# API-Dashboard

Collection de composants React pour faciliter la création de **tableaux de bords territoriaux**.

Demo : 
- [Odema](https://www.geo2france.fr/public/odema/dashboard/) ([code source](https://github.com/geo2france/odema-dashboard))
- [Clicnat](https://dashboard.clicnat.fr/)

![capture d'écran](screenshot.png)

## Points forts

- ✅ Compatible avec de **nombreux fournisseurs de données** (WFS, Datafair, fichiers statiques csv ou json, etc.),
- ✅ **Traitements** de données possibles (filtres, agréations, etc. via SQL ou JavaScript),
- ✅ Créez vos dataviz en utilisants [Apache ECharts](https://echarts.apache.org/) ou n'importe quelle bibliothèque web,
- ✅ Application cliente : peut-être mise à disposition des utilisateurs via un **simple server web** (HTTP/HTTPS) sans configuration particulière,
- ✅ Ecriture des tableaux de bord en **JSX/TSX** : combiner la clarté du XML avec la souplesse et puissance du JavaScript/TypeScript.


## Installation

## Installer nvm et Node.js

- Sur Windows : https://github.com/coreybutler/nvm-windows?tab=readme-ov-file#install-nvm-windows
- Sur Linux : `apt install nvm`

Ensuite, depuis un terminal ([Powershell](https://learn.microsoft.com/fr-fr/powershell/scripting/install/install-powershell-on-windows?view=powershell-7.5) ou autre) : 
```bash
# Installer la dernière vers LTS de Node.js
nvm install --lts
```

## Créer un tableau de bord
Pour créer un nouveau tableau de bord :

```sh
npm init @geo2france/api-dashboard@latest nom-du-projet
cd nom-du-projet && npm install

# Lancer le serveur de développement
npm run dev
```

Consulter la [documentation](https://geo2france.github.io/api-dashboard/) du projet.


