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

import '../../index.css'

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

interface DashboardApprProps {
  title?: string;
  subtitle?: string;
  route_config: RouteConfig[];
  theme?: ThemeConfig;
  logo: string;
  brands?: Partner[];
}

const DashboardApp: React.FC<DashboardApprProps> = ({route_config, theme, logo, brands, title, subtitle}) => {

    const context_values = { title, subtitle, logo };

    return (
        <QueryClientProvider client={queryClient}>
          <ConfigProvider theme={theme || default_theme /* Merger plutôt ?*/}>
          <AppContext.Provider value={ context_values }>
            <HashRouter>
                <Routes>
                  <Route
                        element={
                            <Layout>
                                <Layout>
                                    <DashboardSider route_config={route_config}/>
                                    <Content style={{width:"85%"}}>
                                        <Outlet />
                                    </Content>
                                </Layout>
                                <DasbhoardFooter brands={brands} />
                            </Layout>
                        }
                    >
                    {generateRoutes(route_config)}
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                </Routes>
            </HashRouter>
            </AppContext.Provider>
          </ConfigProvider>
        </QueryClientProvider>
    )
}

export default DashboardApp;