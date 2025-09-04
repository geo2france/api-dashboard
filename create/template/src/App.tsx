import './index.css';

import { WfsProvider, DatafairProvider, DashboardApp } from "@geo2france/api-dashboard";
import { config } from './config'

/** Data provider **/
export const geo2franceProvider = WfsProvider("https://www.geo2france.fr/geoserver/ows")
export const ademe_opendataProvider = DatafairProvider("https://data.ademe.fr/data-fair/api/v1/datasets") 



const App: React.FC = () => {
  return (
    <DashboardApp {...config} />
  )
};

export default App;
