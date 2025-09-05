import './index.css';

import { DashboardApp } from "@geo2france/api-dashboard";
import { config } from './config'



const App: React.FC = () => {
  return (
    <DashboardApp {...config} />
  )
};

export default App;
