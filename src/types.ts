export type SimpleRecord = Record<string, any>; // Une entité de données générique. Limiter le any ?

export type License = ('CC' | 'BY' | 'SA' | 'NC' | 'ZERO' | 'PD' | 'NC');

export type RouteConfig = {
    path: string;
    label?: string;
    icon?: React.ReactNode;
    element: React.ReactNode;
    children?: RouteConfig[];
    hidden?: boolean;
  }

export type Partner = {
    logo: string;
    name: string;
    url?: string;
}