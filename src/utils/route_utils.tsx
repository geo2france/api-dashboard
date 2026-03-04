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


export const generateMenuItems = (routes: RouteConfig[], parentPath = ""): MenuItem[] => {
    const out = routes.filter((route)=> route.hidden != true).map((route) => {
        const fullPath = `${parentPath}/${route.path}`;
    
        const menuItem: MenuItem = {
        key: fullPath,
        label: route.children ? <> {route.label || route.path}</> : <NavLink to={fullPath}>{route.label || route.path}</NavLink>,
        icon: route.icon,
        ...(route.children && { children: generateMenuItems(route.children, fullPath) }), // Ajout conditionnel des enfants. Legacy
        };


        return menuItem;
    });
    
    return buildMenuTree(out)
  }

/** AI generated function */
function buildMenuTree(items: MenuItem[]): MenuItem[] {
  // Trier par profondeur de path
  const sorted = [...items].sort(
    (a, b) =>
      //@ts-ignore
      a.key.split("/").filter(Boolean).length - b.key.split("/").filter(Boolean).length
  );

  const menuMap = new Map<string, any>();
  const roots: MenuItem[] = [];

  for (const item of sorted) {
    //@ts-ignore
    const normalizedKey = item.key.replace(/\/$/, "") || "/";
    const segments = normalizedKey.split("/").filter(Boolean);
    const parentKey = segments.length > 0
      ? "/" + segments.slice(0, -1).join("/")
      : null;

    const parent = parentKey ? menuMap.get(parentKey) : null;

    // On clone l'item pour ne pas muter l'original
    const menuItem = { ...item, key: normalizedKey };
    menuMap.set(normalizedKey, menuItem);

    if (parent) {
      parent.children = parent.children ?? [];
      parent.children.push(menuItem);
    } else {
      roots.push(menuItem);
    }
  }

  return roots;
}