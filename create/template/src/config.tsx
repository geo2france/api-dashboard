//Config : theme, route, title, etc..
import { DashboardConfig } from '@geo2france/api-dashboard';
import { HomePage } from './pages/home';
import { MaPremierePage } from './pages/page1';
import { HeatMapOutlined, PieChartOutlined } from '@ant-design/icons';
import MyLogo from '/img/logo.svg?url';
import { PageBiodiv } from './pages/page_biodiv';



export const config:DashboardConfig = {
    // Le theme peux être personnalisé : https://ant.design/docs/react/customize-theme#seedtoken
    theme : { 
      token: {
        colorPrimary: "#95c11f",
        linkHoverDecoration:'underline',
        colorLink:'#0f4496',
        colorLinkHover:'#0D2449',
        borderRadius:4,
        fontFamily:'Inter',
        },
      components:{
        Timeline:{
          itemPaddingBottom:40
        },
        Form:{
          labelColor:'rgba(0,0,0,0.7)'
        }
      }
    },
    title:"Api-dashboard",
    subtitle:"Tableau de bord de demo - Template",
    logo:MyLogo,
    brands: [
         { logo: MyLogo, name:"Geo2France", url:"https://www.geo2france.fr/"},
        ],
    routes:[
        { 
            path:"",
            element:<HomePage />,
            hidden:true,
        },
        { 
            path:"page1",
            label:"Première page",
            element:<MaPremierePage />,
            icon: <HeatMapOutlined />
        },
        { 
            path:"biodiversite",
            label:"Biodiversité",
            element:<PageBiodiv />,
            icon: <PieChartOutlined />
        }
    ]
}