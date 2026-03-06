//Retourne les routes et le menu

import { NavLink, Outlet, Route } from "react-router-dom";
import { RouteConfig } from "../types";
import type { MenuProps } from 'antd';
import React from "react";
type MenuItem = Required<MenuProps>['items'][number];

export const generateRoutes = (routes: RouteConfig[]) =>
    routes.map((route) => (
      <Route key={route.path} path={route.path} element={route.children ? <Outlet /> :  route.element}>
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


/** AI Generated,
 * Get first "viewable" route (aka "not a group")
 * Used for index route
 */
export function getFirstValidElement(
  routes: React.ReactElement[]
): React.ReactElement | null {

  function isEmptyOutlet(el: React.ReactNode): boolean {
    return React.isValidElement(el) && el.type === Outlet;
  }
  for (const route of routes) {
    const el = route.props.element;

    if (el && !isEmptyOutlet(el)) { // Page
      return el;
    }

    //Group
    const children = React.Children.toArray(route.props.children).filter(
      React.isValidElement
    ) as React.ReactElement[];

    if (children.length > 0) {
      const firstChild = getFirstValidElement(children);
      if (firstChild) return firstChild;
    }
  }

  return null;
}