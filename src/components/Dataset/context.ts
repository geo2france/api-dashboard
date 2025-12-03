import { createContext } from "react";
import { dataset } from "./Dataset"

interface DatasetRegistryContextValue {
  register: (dataset: dataset) => void;
  clear: ()=> void;
  get: (name: string) => dataset | undefined;
  getAll: () => Record<string, dataset>;
}
export const DatasetRegistryContext = createContext<DatasetRegistryContextValue>({
  register: () => {},
  clear: () => {},
  get: () => undefined,
  getAll: () => ({}),
});