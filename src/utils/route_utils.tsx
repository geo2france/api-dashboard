//Retourne les routes et le menu

import { NavLink, Route } from "react-router-dom";
import { RouteConfig } from "../types";
import type { MenuProps } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];

export const generateRoutes = (routes: RouteConfig[]) =>
    routes.map((route) => (
      <Route key={route.path} path={route.path} element={!route.children && route.element}>
        {route.children && generateRoutes(route.children)}
      </Route>
    ));


export const generateMenuItems = (routes: RouteConfig[], parentPath = ""): MenuItem[] =>
    routes.filter((route)=> route.hidden != true).map((route) => {
        const fullPath = `${parentPath}/${route.path}`;
    
        const menuItem: MenuItem = {
        key: fullPath,
        label: route.children ? <> {route.label || route.path}</> : <NavLink to={fullPath}>{route.label || route.path}</NavLink>,
        icon: route.icon,
        ...(route.children && { children: generateMenuItems(route.children, fullPath) }), // Ajout conditionnel des enfants
        };
    
        return menuItem;
    });

