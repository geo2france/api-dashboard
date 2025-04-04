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


```tsx
import { WfsProvider, DatafairProvider, DashboardApp } from "api-dashboard";
import { Partner, RouteConfig } from "api-dashboard/src/types";
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
     />
  )
};

export default App;

```