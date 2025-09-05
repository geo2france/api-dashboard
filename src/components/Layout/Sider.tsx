
import React, { CSSProperties, useContext, useState } from "react";
import { Layout, Menu, theme, Row, Col, Button, Divider } from "antd";

import { NavLink, useLocation } from "react-router-dom";

import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { generateMenuItems } from "../../utils/route_utils";
import { RouteConfig } from "../../types";
import { AppContext } from "./DashboardApp";


const style_img: CSSProperties = {
  height:52,
  maxWidth:"100%",
  objectFit:"contain"
};

interface DbSiderProps {
  logo?: string; //Override app logo
  route_config?:RouteConfig[];
  //menu?: React.ReactElement; // Pour passer directement un menu (remplace celui du Sider)
  style?: CSSProperties;
}

const DashboardSider: React.FC<DbSiderProps> = ({style, logo, route_config}) => {
  const {logo: appLogo, title} = useContext(AppContext)

  const { token } = theme.useToken();
  const { pathname:selectedKey } = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [collapsed, setCollapsed] = useState(isMobile ? true : false);

  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth < 768);
  });

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const siderStyle: CSSProperties = {
    overflow: 'auto',
    height: "100vh",
    backgroundColor: token.colorBgContainer,
    zIndex: 2, 
    position: 'sticky',
    top:'0',
    borderRight: "1px solid #ccc", 
    ...style
  };

  return (
    <Layout.Sider
      theme="light"
      collapsible
      collapsedWidth={isMobile ? 40 : 80} //Utiliser la propriété breakpoint ?
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      style={siderStyle}
      width={isMobile ? '80%' : 220}
      trigger={null}
    >
      <Row justify="center">
        <Col span={24}>
          <div
            style={{
              margin: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: token.colorBgElevated,
            }}
          >


            <NavLink to={""} style={{
                display:collapsed ? 'none' : undefined,
                marginTop:8, marginLeft:8
                }}>
              <img style={style_img} src={appLogo} alt={title} />{/* TODO : utiliser une version mini du logo en affichage mobile */}
            </NavLink>
            <Divider style={{display:collapsed ? 'none' : undefined}} type="vertical" />
            <Button 
              type="text"
              onClick={() => setCollapsed(!collapsed)}
              icon={collapsed ? <MdOutlineKeyboardDoubleArrowRight/> : <MdOutlineKeyboardDoubleArrowLeft/>}
              style={{
                fontSize: '28px',
                width: 32,
                height: 32,
                //backgroundColor: token.colorFillSecondary,
                marginTop:8
              }}
              />


          </div>
        </Col>
        <Col span={24}>
          <Menu
            items={ route_config && generateMenuItems(route_config)}
            selectedKeys={[selectedKey]}
            mode="inline"
            style={{ marginTop: "20px", width: "100%" }}
          />
        </Col>
      </Row>
    </Layout.Sider>
  );
};


export default DashboardSider ;