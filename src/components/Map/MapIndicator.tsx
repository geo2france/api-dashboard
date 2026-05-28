import alasql from "alasql"
import { useDataset } from "../../dsl"
import { Map } from "./Map"
import { SimpleRecord } from "../../types"
import { useMemo, useState } from "react"
import { Segmented } from "antd"

export const MapIndicator:React.FC<any> = ({dataset:dataset_input, interpolationMethod="jenks", nClasses=4}) => {

    const [level, setLevel] = useState<'commune' | 'epci'>('commune')

    const dataset = useDataset(dataset_input)
    const dataset_ref_commune = useDataset("ref_commune")
    const dataset_ref_epci = useDataset("ref_epci")


    const data = dataset?.data
    const data_ref = dataset_ref_commune?.data
    const data_ref_epci = dataset_ref_epci?.data


    const joined = useMemo( () => data && data_ref && alasql(` 
        SELECT geo.[code_insee], geo.[nom_officiel], geo.[codes_siren_des_epci], geo.[geometry], COALESCE(SUM(d.[valeur]), 0) as valeur
        FROM ? d
        RIGHT JOIN ? geo ON geo.code_insee = d.code_insee
        GROUP BY geo.[code_insee], geo.[nom_officiel], geo.[codes_siren_des_epci], geo.[geometry]
        `,[data, data_ref]) as SimpleRecord[] || []
    ,[data, data_ref])

    const agg_epci = useMemo( () => joined.length > 0 && data_ref_epci && alasql(`
        SELECT geo.[code_siren], geo.[nom_officiel], geo.[geometry], COALESCE( SUM(j.[valeur] ), 0) as valeur
        FROM ? j
        RIGHT JOIN ? geo ON geo.[code_siren] = j.[codes_siren_des_epci]
        GROUP BY geo.[code_siren], geo.[nom_officiel], geo.[geometry]
        `,[joined, data_ref_epci]) as SimpleRecord[] || []
    ,[joined, data_ref_epci])
    
    console.log('com', joined)
    console.log('epci', agg_epci)

    

    return (
        <div>
            <Segmented
                value={level}
                options={['commune', 'epci']}
                onChange={(value) => {
                    //@ts-ignore
                    setLevel(value); // string
                }}
            />
        <Map dataset={level == 'commune' ? joined : agg_epci} valueKey="valeur" interpolationMethod={interpolationMethod} nClasses={nClasses} popup/>
        </div>
    )
}


/**
 * Usage : 
 *   <Dashboard debug>
            <Dataset
                type="wfs"
                id="ref_commune"
                url="https://data.geopf.fr/wfs/ows"
                resource="ADMINEXPRESS-COG-CARTO-PE.LATEST:commune"
            >
                <Filter field="code_insee_de_la_region">32</Filter>
            </Dataset>

            <Dataset
                type="wfs"
                id="ref_epci"
                url="https://data.geopf.fr/wfs/ows"
                resource="ADMINEXPRESS-COG-CARTO-PE.LATEST:epci"
            >
                <Transform>{(data: SimpleRecord[]) => data.filter(r => {
                    const codes = String(r.codes_insee_des_departements_membres ?? "");
                    return ["02", "59", "60", "62", "80"].some(c => codes.includes(c));
                })}</Transform>
            </Dataset>

            <Dataset
                type="wfs"
                id="irve"
                url="https://www.geo2france.fr/geoserver/geo2france/ows"
                resource="geo2france:irve"
                meta={{ srsname: "EPSG:4326" }}
            >
            </Dataset>
            <MapIndicator dataset="irve" />
        </Dashboard> 
 * 
 * 
 */