import { SimpleRecord } from "@geo2france/api-dashboard"
import { Dashboard, Dataset, Join, Statistics, StatisticsCollection, Transform , Map} from "@geo2france/api-dashboard/dsl"

const stationStatusParser = (response:any):SimpleRecord[] => response.data.stations.map((row:any) => ({
                num_bikes_available: row.num_bikes_available,
                station_id: row.station_id,
                num_docks_available: row.num_docks_available
                }))

export const PageVelo:React.FC = ({}) => {

    return (
    <Dashboard debug>

        <Dataset
            id="station_info"
            type="file"
            url="https://media.ilevia.fr/opendata"
            resource="station_information.json"
        >
            <Transform>{(response:any) => response.data.stations}</Transform>
        </Dataset>

        <Dataset
            id="station_status"
            type="file"
            url="https://media.ilevia.fr/opendata"
            resource="station_status.json"
        >
            <Transform>{stationStatusParser}</Transform>

            <Join dataset="station_info" joinKey={"station_id"} />
        </Dataset>

        <Dataset
            id="station_status_stats"
            type="file"
            url="https://media.ilevia.fr/opendata"
            resource="station_status.json"
        >
            <Transform>{stationStatusParser}</Transform>
            <Join dataset="station_info" joinKey={"station_id"} />
            <Transform>SELECT 
                    sum(num_docks_available) as num_docks_available,
                    sum(num_bikes_available) as num_bikes_available,
                    sum(num_bikes_available) / sum(num_bikes_available + num_docks_available)*100 as tx_occupation 
                FROM ?</Transform>

        </Dataset>
    
        <StatisticsCollection title="Réseau">
            <Statistics dataset="station_status_stats" dataKey="num_docks_available" color="slateblue" 
            title="Emplacements disponibles" icon="material-symbols:bike-dock" unit="dock"/>
            <Statistics dataset="station_status_stats" dataKey="num_bikes_available" color="seagreen" 
    title="Vélo disponibles" icon="material-symbols:pedal-bike" unit="vélos"/>
            <Statistics dataset="station_status_stats" dataKey="tx_occupation" color="tomato" 
    title="Occupation des stations" icon="entypo:progress-two" unit="%" valueFormatter={(r) => r.value.toLocaleString(undefined,{maximumFractionDigits:1})}/>
        </StatisticsCollection>
    
    <Map dataset="station_status" xKey="lon" yKey="lat" categoryKey="post_code" popup popupFormatter={(p) => `${p.name} : ${p.num_bikes_available} / ${p.num_bikes_available + p.num_docks_available} `  }/>
    </Dashboard>)
}