import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider, Layout, ThemeConfig } from "antd";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import { Partner, RouteConfig } from "../../types";
import { generateRoutes } from "../../utils/route_utils";
import DashboardSider from "./Sider";
import { Content } from "antd/es/layout/layout";
import { ErrorComponent } from "./Error";
import { DasbhoardFooter } from "./Footer";
import { createContext } from "react";
import { HelmetProvider } from "react-helmet-async";
import { createDatasetRegistry } from "../Dataset/hooks";
import { DatasetRegistryContext } from "../Dataset/context";
import { ControlContext, CreateControlesRegistry } from "../Control/Control";

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
  
export const AppContext = createContext<AppContextProps>({});  

export interface DashboardConfig {
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
}


const DashboardApp: React.FC<DashboardConfig> = ({routes, theme, logo, brands, footerSlider, title, subtitle}) => {

    const context_values = { title, subtitle, logo };

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
                                      <DashboardSider route_config={routes}/>
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