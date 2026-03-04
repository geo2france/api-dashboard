import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider, Layout, ThemeConfig } from "antd";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import { Partner, RouteConfig } from "../../types";
//import { generateRoutes } from "../../utils/route_utils";
import DashboardSider from "./Sider";
import { Content } from "antd/es/layout/layout";
import { ErrorComponent } from "./Error";
import { DasbhoardFooter } from "./Footer";
import { Children, createContext, isValidElement, ReactElement, ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { createDatasetRegistry } from "../Dataset/hooks";
import { DatasetRegistryContext } from "../Dataset/context";
import { ControlContext, CreateControlesRegistry } from "../Control/Control";
import slug from 'slug'
import { generateRoutes } from "../../utils/route_utils";
//import '../../index.css' //TODO a intégrer en jsx

const queryClient = new QueryClient()

const default_theme:ThemeConfig = { 
    token: {
      colorPrimary: "#95c11f",
      linkHoverDecoration:'underline',
      colorLink:'#0f4496',
      colorLinkHover:'#0D2449',
      borderRadius:4,
      fontFamily:'Inter'
      },
    components:{
      Timeline:{
        itemPaddingBottom:40
      },
      Form:{
        labelColor:'rgba(0,0,0,0.7)'
      }
    }
  }


interface AppContextProps {
    title?: string;
    subtitle?: string;
    logo?: string;
}

export interface PageProps {
  title: string
  icon?: ReactNode
  hidden?: boolean
  children?: ReactNode
}
  
export const AppContext = createContext<AppContextProps>({});  

export interface DashboardConfig {
  /** Pages de dashboard */
  children?: ReactElement<PageProps> | ReactElement<PageProps>[];


  /**
  * Titre principal du tableau de bord (affiché dans le header ou le titre de page).
  */
  title?: string;

  /**
   * Sous-titre du tableau de bord (optionnel, peut être affiché sous le titre principal).
  */
  subtitle?: string;

  /**
   * Liste des routes de l'application (chaque route correspond à une page du tableau de bord).
   * @deprecated since 1.22. Use DashboardApp childrens.
  */
  routes: RouteConfig[];

  /**
   * Configuration du thème Ant Design (permet de personnaliser les couleurs, la typographie, etc.).
  */
  theme?: ThemeConfig;

  /**
   * URL ou chemin du logo à afficher dans le tableau de bord.
  */
  logo: string;

  /**
   * Liste optionnelle de partenaires ou marques à afficher dans le footer ou ailleurs.
  */
  brands?: Partner[];

  /**
   * Active ou désactive le mode “slider” dans le pied de page (faire défiler les logos de partenaires).
  */
  footerSlider?: boolean;

  /** 
   * Désactiver la mention à Géo2France 
   */
  disablePoweredBy?: boolean;
}


const DashboardApp: React.FC<DashboardConfig> = ({children, theme, routes: routes_legacy, logo, brands, footerSlider, title, subtitle, disablePoweredBy=false}) => {

    const context_values = { title, subtitle, logo };

    const pages = Children.toArray(children)
                          .filter(isValidElement) as ReactElement<PageProps>[];

    const routes:RouteConfig[] = pages.length > 1 ? pages.map((page) => {
      if (typeof(page.type) != 'string' && page.type.name == PagesGroup.name ){ // Groupe
        return ({
            label: page.props.title, 
            path:slug(page.props.title),
            element:undefined, // Pas de route pour les groupes
            hidden:page.props.hidden ?? false,
            icon:page.props.icon,
            children: Children.toArray(page.props.children)?.map( (c:any) => (
              { 
                label: c.props.title, // A factoriser avec les pages hors groupes
                path: slug(c.props.title),
                element:c,
                hidden:c.props.hidden ?? false,
                icon:c.props.icon
              }
            )
            )
        })
      }else { //Pages directes (sans groupe)
              return ({ 
                    label: page.props.title,
                    path:slug(page.props.title),
                    element:page,
                    hidden:page.props.hidden ?? false,
                    icon:page.props.icon
                })
      }
    }) : routes_legacy ; // Pour rétro-compatibiltié

    return (
        <QueryClientProvider client={queryClient}>
          <ConfigProvider theme={theme || default_theme /* Merger plutôt ?*/}>
          <HelmetProvider>
          <AppContext.Provider value={ context_values }>
            <DatasetRegistryContext.Provider value={ createDatasetRegistry() } >
            <ControlContext.Provider value={CreateControlesRegistry()}>

              <HashRouter>
                  <Routes>
                    <Route
                          element={
                                  <Layout hasSider  style={{ minHeight: '100vh' }}>
                                      <DashboardSider route_config={routes} poweredBy={!disablePoweredBy}/>
                                      <Layout> 
                                      <Content style={{width:"100%"}}>
                                          <Outlet />
                                      </Content>
                                      <DasbhoardFooter brands={brands} slider={footerSlider} />
                                      </Layout> 
                                  </Layout>
                          }
                      >
                      {generateRoutes(routes)}
                      <Route path="*" element={<ErrorComponent />} />
                    </Route>
                  </Routes>
              </HashRouter>
            </ControlContext.Provider>
            </DatasetRegistryContext.Provider>
          </AppContext.Provider>
          </HelmetProvider>
          </ConfigProvider>
        </QueryClientProvider>
    )
}

export default DashboardApp;

/** Regrouper des pages dans le menu */
export const PagesGroup:React.FC<PageProps> = ({children}:PageProps) => {
  return children
}