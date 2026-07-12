
import React, { CSSProperties, useContext, useEffect, useState } from "react";
import { Layout, Menu, theme, Row, Col, Button, Typography, ConfigProvider, Tooltip } from "antd";

import { NavLink, useLocation } from "react-router-dom";

import { generateMenuItems } from "../../utils/route_utils";
import { RouteConfig } from "../../types";
import { AppContext } from "./DashboardApp";
import { Icon } from "@iconify/react";
import { Z_INDEX } from "../../utils/zIndex";
import { ThemeToggle, useThemeContext, useBrandForeground, WCAG_CONTRAST } from "../../theme";
import { useVisualIdentityLogo } from "../../theme/hooks/useVisualIdentityLogo";
const { Text } = Typography

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
  poweredBy?: boolean
}

const DashboardSider: React.FC<DbSiderProps> = ({style, logo, route_config, poweredBy=true}) => {
  const {logo: appLogo, title} = useContext(AppContext)
  const { resolvedMode, isModeLocked } = useThemeContext();
  const visualIdentityLogo = useVisualIdentityLogo();
  const effectiveLogo = logo ?? visualIdentityLogo?.src ?? appLogo;
  const effectiveAlt = visualIdentityLogo?.alt ?? title;
  const hasLogoAlt = Boolean(effectiveAlt && effectiveAlt.trim().length > 0);

  const { token } = theme.useToken();
  const brandFg = useBrandForeground();
  // Avant-plan de marque garanti accessible (cf. useBrandForeground) :
  // - sur le fond du conteneur, pour le focus ring (seuil UI 3:1)
  // - sur la pastille sélectionnée (colorPrimaryBgHover), pour le texte (4.5:1)
  const focusRingColor = brandFg(token.colorBgContainer, WCAG_CONTRAST.UI);
  const selectedItemColor = brandFg(token.colorPrimaryBgHover, WCAG_CONTRAST.TEXT);
  const { pathname:selectedKey } = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [collapsed, setCollapsed] = useState(isMobile ? true : false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);


  const siderStyle: CSSProperties = {
    overflow: 'auto',
    height: "100vh",
    backgroundColor: token.colorBgContainer,
    zIndex: Z_INDEX.SIDER,
    position: 'sticky',
    top:'0',
    borderRight: `1px solid ${token.colorBorderSecondary}`,
    ...style
  };

  return (
    <Layout.Sider
      theme={resolvedMode === "dark" ? "dark" : "light"}
      collapsible
      collapsedWidth={isMobile ? 56 : 80} //Utiliser la propriété breakpoint ?
      collapsed={collapsed}
      onCollapse={setCollapsed}
      style={siderStyle}
      width={isMobile ? '80%' : 220}
      trigger={null}
    >
      <style>
        {`
          #dashboard-sider-nav .ant-menu-item a:hover {
            text-decoration: none;
          }
          .ant-menu-submenu-popup .ant-menu-item a:hover {
            text-decoration: none;
          }
          /* Empêche l'indentation des éléments de sous-menus */
          #dashboard-sider-nav .ant-menu-sub .ant-menu-item {
            padding-left: 24px !important;
          }
          .dashboard-sider-home-link:focus-visible,
          .dashboard-sider-toggle:focus-visible {
            outline: 2px solid ${focusRingColor};
            outline-offset: 2px;
            box-shadow: 0 0 0 3px ${token.colorBgContainer};
            border-radius: 6px;
          }
          @keyframes dashboard-sider-powered-fade-in {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: none; }
          }
        `}
      </style>
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


            <NavLink
              to={"/"}
              style={{
                display: collapsed ? 'none' : undefined,
                marginTop: 8,
              }}
              className="dashboard-sider-home-link"
              aria-label="Aller à l'accueil"
            >
              <img
                style={style_img}
                src={effectiveLogo}
                alt={hasLogoAlt ? effectiveAlt : ""}
                aria-hidden={hasLogoAlt ? undefined : true}
                width={180}
                height={52}
                loading="eager"
                decoding="async"
              />
            </NavLink>
          </div>
        </Col>
        <Col span={24}>
          <nav id="dashboard-sider-nav" aria-label="Navigation principale">
            <ConfigProvider
              theme={{
                components: {
                  Menu: {
                    // — État repos : texte atténué → l'item actif ressort par contraste
                    itemColor: token.colorTextSecondary,
                    itemBg: "transparent",

                    // — Hover : pastille un cran plus foncée que la boîte → visible dessus
                    itemHoverColor: token.colorText,
                    itemHoverBg: token.colorFillSecondary,

                    // — Sélectionné : avant-plan garanti accessible sur la pastille
                    //   teintée marque. La primaire est conservée là où elle passe le
                    //   contraste (dark), sinon repli neutre colorText (light). Voir
                    //   useBrandForeground.
                    itemSelectedColor: selectedItemColor,
                    itemSelectedBg: token.colorPrimaryBgHover,
                    subMenuItemSelectedColor: selectedItemColor,

                    // — Boîte du sous-menu : gris clair
                    subMenuItemBg: token.colorFillTertiary,

                    // — Rythme & forme
                    itemBorderRadius: token.borderRadiusLG,
                    itemMarginInline: 8,
                    itemHeight: 40,
                    activeBarBorderWidth: 0,
                  },
                },
              }}
            >
              <Menu
                items={ route_config && generateMenuItems(route_config)}
                selectedKeys={[selectedKey]}
                mode="inline"
                style={{ marginTop: "20px", width: "100%" }}
              />
            </ConfigProvider>
          </nav>
        </Col>
      </Row>
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: collapsed ? "8px 0 12px" : "8px 8px 12px",
        display: "flex",
        flexDirection: "column",
        alignItems: collapsed ? "center" : "stretch",
        justifyContent: "center",
        gap: 2,
      }}>
        <Tooltip title={collapsed ? "Déplier le menu" : "Replier le menu"} placement="right" open={collapsed ? undefined : false}>
          <Button
            type="text"
            className="dashboard-sider-toggle"
            block={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
            icon={
              <span style={{ fontSize: 18, lineHeight: 0, display: "inline-flex" }}>
                <Icon
                  icon={collapsed ? "material-symbols:keyboard-double-arrow-right-rounded" : "material-symbols:keyboard-double-arrow-left-rounded"}
                  aria-hidden="true"
                />
              </span>
            }
            aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
            aria-expanded={!collapsed}
            aria-controls="dashboard-sider-nav"
            style={{
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              width: collapsed ? 40 : undefined,
              paddingInline: collapsed ? 0 : 16,
              borderRadius: 8,
              textAlign: "left",
              touchAction: "manipulation",
              transition: prefersReducedMotion ? "none" : undefined,
            }}
          >
            {!collapsed && "Replier le menu"}
          </Button>
        </Tooltip>
        { !isModeLocked && <ThemeToggle block={!collapsed} showLabel={!collapsed} /> }
        { poweredBy && !collapsed && (
          <Text
            type="secondary"
            style={{
              fontSize: token.fontSizeSM,
              height: 40,
              display: "flex",
              alignItems: "center",
              paddingInline: 16,
              marginTop: 12,
              animation: prefersReducedMotion
                ? undefined
                : "dashboard-sider-powered-fade-in 0.25s ease 0.3s both",
            }}
          >
            Développé par&nbsp;{" "}
            <a
              href="https://github.com/geo2france/api-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Géo2France (ouvre dans un nouvel onglet)"
              translate="no"
              style={{
                color: token.colorText,
                textDecoration: "underline",
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              Géo2France
              <Icon icon="ri:external-link-line" aria-hidden="true" />
            </a>
          </Text>
        )}
      </div>
    </Layout.Sider>
  );
};


export default DashboardSider ;