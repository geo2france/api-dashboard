import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider, Layout, ThemeConfig } from "antd";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import { Partner, RouteConfig } from "../../types";
import { generateRoutes } from "../../utils/route_utils";
import DashboardSider from "./Sider";
import { Content } from "antd/es/layout/layout";
import { ErrorComponent } from "./Error";
import { DasbhoardFooter } from "./Footer";

const queryClient = new QueryClient()

const default_theme:ThemeConfig = { //Odema theme, changer par theme default G2F
    token: {
      colorPrimary: "#95c11f",
      linkHoverDecoration:'underline',
      colorLink:'#FF6A48',
      colorLinkHover:'#9D7156',
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

interface DashboardApprProps {
  route_config: RouteConfig[];
  theme?: ThemeConfig;
  logo: string;
  brands?: Partner[]
}

const DashboardApp: React.FC<DashboardApprProps> = ({route_config, theme, logo, brands}) => {
 
    return (
        <QueryClientProvider client={queryClient}>
          <ConfigProvider theme={theme || default_theme /* Merger plutôt ?*/}>
            <HashRouter>
                <Routes>
                  <Route
                        element={
                            <Layout>
                                <Layout>
                                    <DashboardSider route_config={route_config} logo={logo}/>
                                    <Content style={{width:"85%"}}>
                                        <Outlet />
                                    </Content>
                                </Layout>
                                <DasbhoardFooter brands={brands} db_logo={logo} />
                            </Layout>
                        }
                    >
                    {generateRoutes(route_config)}
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                </Routes>
            </HashRouter>
          </ConfigProvider>
        </QueryClientProvider>
    )
}

export default DashboardApp;