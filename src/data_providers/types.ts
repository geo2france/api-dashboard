// Types from Refinedev

export interface Pagination {
    /**
     * Initial page index
     * @default 1
     */
    current?: number;
    /**
     * Initial number of items per page
     * @default 10
     */
    pageSize?: number;
    /**
     * Whether to use server side pagination or not.
     * @default "server"
     */
    mode?: "client" | "server" | "off";
  }

  // Filters are used as a suffix of a field name:

// | Filter              | Description                       |
// | ------------------- | --------------------------------- |
// | `eq`                | Equal                             |
// | ne                  | Not equal                         |
// | lt                  | Less than                         |
// | gt                  | Greater than                      |
// | lte                 | Less than or equal to             |
// | gte                 | Greater than or equal to          |
// | in                  | Included in an array              |
// | nin                 | Not included in an array          |
// | contains            | Contains                          |
// | ncontains           | Doesn't contain                   |
// | containss           | Contains, case sensitive          |
// | ncontainss          | Doesn't contain, case sensitive   |
// | null                | Is null or not null               |
// | startswith          | Starts with                       |
// | nstartswith         | Doesn't start with                |
// | startswiths         | Starts with, case sensitive       |
// | nstartswiths        | Doesn't start with, case sensitive|
// | endswith            | Ends with                         |
// | nendswith           | Doesn't end with                  |
// | endswiths           | Ends with, case sensitive         |
// | nendswiths          | Doesn't end with, case sensitive  |
export type CrudOperators =
| "eq"
| "ne"
| "lt"
| "gt"
| "lte"
| "gte"
| "in"
| "nin"
| "ina"
| "nina"
| "contains"
| "ncontains"
| "containss"
| "ncontainss"
| "between"
| "nbetween"
| "null"
| "nnull"
| "startswith"
| "nstartswith"
| "startswiths"
| "nstartswiths"
| "endswith"
| "nendswith"
| "endswiths"
| "nendswiths"
| "or"
| "and";

export type SortOrder = "desc" | "asc" | null;

export type LogicalFilter = {
field: string;
operator: Exclude<CrudOperators, "or" | "and">;
value: any;
};

export type ConditionalFilter = {
key?: string;
operator: Extract<CrudOperators, "or" | "and">;
value: (LogicalFilter | ConditionalFilter)[];
};

export type CrudFilter = LogicalFilter | ConditionalFilter;
export type CrudSort = {
field: string;
order: "asc" | "desc";
};

export type CrudFilters = CrudFilter[];
export type CrudSorting = CrudSort[];

export interface GetListResponse {
    data: any[];
    total: number;
    geojson?: any;
    [key: string]: any;
}

export interface DataProvider {
    getApiUrl: () => string;

    /** Fonction principale retournant les données */
    getData: (params: {
        resource: string;
        filters?: CrudFilters;
        pagination?: Pagination;
        sorters?: CrudSorting;
        meta?: any;
    }) => Promise<GetListResponse>;
}

