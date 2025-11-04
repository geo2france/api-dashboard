# DashboardApp

🛠️ documentation à rédiger.

Composant principal, permettant de gérer : 
- Les informations générals du projet (logo, titre, etc.)
- La navigation (menu et routes)
- Le style (thème)
- Les partenaires du projets (bandeau de logo)

Il permet de disposer d'une mise en page standard et responsive : 
- Un sider avec menu de navigation
- Un footer avec les logos
- Un contexte avec les informations du projets

## Contexte du projet

Le contexte de l'application se compose d'un titre (`title`),
d'un sous-titre (`subtitle`), et d'un logo (`logo`).
Ces propriétés sont ensuite accessibles grâce au hook `useContext(AppContext)`.

## Sider

L'élément `Sider` est affiché à gauche de la page, et contient un menu
permettant de naviguer entre les différentes pages de l'appli.
La liste des pages est définie par l'option `route_config`.

## Footer

Par défaut, l'élément `Footer` affiche les logos des partenaires
du projet. Chaque partenaire est défini par un objet sépcifiant
son nom (`name`), son logo (`logo`) et un lien vers son site (`url`).

L'apparence du Footer peut être modifiée en passant un objet
au format `CSSProperties` dans l'option `footer_style`.


```tsx
import { WfsProvider, DatafairProvider, DashboardApp } from "api-dashboard";
import { Partner, RouteConfig } from "api-dashboard/src/types";
import { CSSProperties } from "react";
import { HomePage } from './pages/home';
import MyLogo from '/img/logo.svg?url';
import { Page1 } from './pages/page1';
import { HeatMapOutlined, PieChartOutlined } from '@ant-design/icons';

/** Data provider **/
export const geo2franceProvider = WfsProvider("https://www.geo2france.fr/geoserver/ows")
export const ademe_opendataProvider = DatafairProvider("https://data.ademe.fr/data-fair/api/v1/datasets") 

/** Logo et partenaires du projets **/
const partenaires:Partner[] = [
  { logo: MyLogo, name:"Geo2France", url:"https://www.geo2france.fr/"},
];

/** Surcharge de l'apparence du footer **/
const footer_style: CSSProperties = {
  overflow: "scroll",
  padding: 5,
}


/*** Renseigner ici les différentes pages du projets **/
const route_config:RouteConfig[] = [
  { 
    path:"",
    element:<HomePage />,
    hidden:true, // Cachée du menu
  },
  { 
    path:"page1",
    label:"Première page",
    element:<Page1 />,
    icon: <HeatMapOutlined />
  },
  { 
    path:"page2",
    label:"Deuxieme page",
    element:<Page1 />,
    icon: <PieChartOutlined />
  }
];

const App: React.FC = () => {
  return(
    <DashboardApp
      title="Api-dashboard"
      subtitle="Tableau de bord de demo - Template"
      route_config={route_config}
      logo={MyLogo}
      brands={partenaires}
      footer_style={footer_style}
     />
  )
};

export default App;

```