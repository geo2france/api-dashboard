import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider, Layout, ThemeConfig } from "antd";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import { Partner, RouteConfig } from "../../types";
import { generateRoutes } from "../../utils/route_utils";
import DashboardSider from "./Sider";
import { Content } from "antd/es/layout/layout";
import { ErrorComponent } from "./Error";
import { DasbhoardFooter } from "./Footer";
import { createContext, useState } from "react";
import { ControlContext } from "../DashboardPage/Page";
import { HelmetProvider } from "react-helmet-async";

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
  title?: string;
  subtitle?: string;
  routes: RouteConfig[];
  theme?: ThemeConfig;
  logo: string;
  brands?: Partner[];
  slider?: boolean;
}


const DashboardApp: React.FC<DashboardConfig> = ({routes, theme, logo, brands, slider, title, subtitle}) => {

    const context_values = { title, subtitle, logo };
    
    /* CONTROLS */
    const [controls, setControles] = useState<Record<string, any>>({});
    const pushControl = (c: Record<string, any>) => {
      setControles(prev => ({
          ...prev, 
          ...c
        }));
    }

    return (
        <QueryClientProvider client={queryClient}>
          <ConfigProvider theme={theme || default_theme /* Merger plutôt ?*/}>
          <HelmetProvider>
          <AppContext.Provider value={ context_values }>
            <ControlContext.Provider value={{ values:controls, pushValue:pushControl  }}>
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
                                      <DasbhoardFooter brands={brands} slider={slider} />
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
          </AppContext.Provider>
          </HelmetProvider>
          </ConfigProvider>
        </QueryClientProvider>
    )
}

export default DashboardApp;