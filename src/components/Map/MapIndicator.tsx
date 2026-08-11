import alasql from "alasql"
import { useDataset } from "../../dsl"
import { interpolationType, Map, MapProps } from "./Map"
import { SimpleRecord } from "../../types"
import { useMemo, useState } from "react"
import { Segmented } from "antd"
import { useApi } from "../../utils/useApi"
import { getProviderFromType } from "../Dataset/Provider"
import { datasetInput } from "../Dataset/hooks"


type GeoLevel = 'commune' | 'epci' | 'département'

interface MapIndicatorProps extends Pick<MapProps, 'highlightProperty' | 'unit'> {
    /** Jeu de données en entrée. Il doit contenir : 
     * - Un colonne "code_insee" (commune) ou "geocode_epci" (epci)
     * - Une colonne "valeur" numérique
     */
    dataset: datasetInput

    interpolationMethod?: interpolationType

    /** Nombre de classe à afficher */
    nClasses?: number

    /** Couleur de base */
    color?: string

    /** Niveau geo du jeu de données. Les JDD EPCI ne permettent pas de ré-agrégation */
    dataLevel: GeoLevel | 'auto'
}

export const MapIndicator:React.FC<MapIndicatorProps> = ({
    dataset:dataset_input, 
    interpolationMethod="jenks", 
    nClasses=4, 
    color, 
    unit,
    highlightProperty,
    dataLevel='auto'}) => {

    const [level, setLevel] = useState<GeoLevel>( dataLevel === 'auto' ? 'commune' : dataLevel)


    const qr_ref_commune = useApi({
        dataProvider: getProviderFromType("wfs")("https://data.geopf.fr/wfs/ows"),
        resource:"ADMINEXPRESS-COG-CARTO-PE.LATEST:commune",
        filters:[{operator:'eq', value:'32', field:'code_insee_de_la_region'}],
        enabled: dataLevel !== 'epci',
    })

    const qr_ref_epci = useApi({
        dataProvider: getProviderFromType("wfs")("https://data.geopf.fr/wfs/ows"),
        resource:"ADMINEXPRESS-COG-CARTO-PE.LATEST:epci",
    })

    const qr_ref_dep = useApi({
        dataProvider: getProviderFromType("wfs")("https://data.geopf.fr/wfs/ows"),
        resource:"ADMINEXPRESS-COG-CARTO-PE.LATEST:departement",
        filters:[{operator:'eq', value:'32', field:'code_insee_de_la_region'}],
        enabled: dataLevel !== 'epci',
    })

    const dataset = useDataset(dataset_input)

    const data = dataset?.data

    const data_ref = qr_ref_commune.data?.data

    const data_ref_epci = qr_ref_epci.data?.data?.filter(r => {
                    const codes = String(r.codes_insee_des_departements_membres ?? "");
                    return ["02", "59", "60", "62", "80"].some(c => codes.includes(c));
                })


                const data_ref_dep = qr_ref_dep?.data?.data

    // undef si le dataset commune est vide/undef
    const joined = useMemo( () => data && data_ref && alasql(` 
        SELECT geo.[code_insee], geo.[nom_officiel], geo.[codes_siren_des_epci], geo.[geometry], SUM(d.[valeur]) as valeur
        FROM ? d
        RIGHT JOIN ? geo ON geo.code_insee = d.code_insee
        GROUP BY geo.[code_insee], geo.[nom_officiel], geo.[codes_siren_des_epci], geo.[geometry]
        `,[data, data_ref]) as SimpleRecord[] || []
    ,[data, data_ref])

    const agg_epci = useMemo( () =>
        // Niveau de départ n'est pas EPCI
        dataLevel !== 'epci' ? joined.length > 0 && data_ref_epci && alasql(`
            SELECT geo.[code_siren] as geocode_epci, geo.[nom_officiel], geo.[geometry], SUM(j.[valeur] ) as valeur
            FROM ? j
            RIGHT JOIN ? geo ON geo.[code_siren] = j.[codes_siren_des_epci]
            GROUP BY geo.[code_siren], geo.[nom_officiel], geo.[geometry]
        ` ,[joined, data_ref_epci]) as SimpleRecord[] || []
        :
        data && data_ref_epci && alasql(`
            SELECT geo.[code_siren] as geocode_epci, geo.[nom_officiel], geo.[geometry], SUM( j.[valeur] ) as valeur
            FROM ? j
            RIGHT JOIN ? geo ON geo.[code_siren] = j.[geocode_epci]
            GROUP BY geo.[code_siren], geo.[nom_officiel], geo.[geometry]
            `, [data, data_ref_epci]) as SimpleRecord[] || []
    ,[data, joined, data_ref_epci])

    const agg_dep = useMemo( () => joined.length > 0 && data_ref_epci && alasql(`
        SELECT geo.[code_insee], geo.[nom_officiel], geo.[geometry], SUM(j.[valeur] ) as valeur
        FROM ? j
        RIGHT JOIN ? geo ON geo.[code_insee] = SUBSTRING(j.[code_insee],1, 2)
        GROUP BY geo.[code_insee], geo.[nom_officiel], geo.[geometry]
        `,[data, data_ref_dep]) as SimpleRecord[] || []
    ,[joined, data_ref_dep])
    
   // console.log('com', joined)
   // console.log('epci', agg_epci)
    //console.log('dep', agg_dep)
    

    return (
        <div>
            <Segmented
                value={level}
                  options={[
                    { label: 'Commune', value: 'commune', disabled: dataLevel == 'epci' },
                    { label: 'EPCI', value: 'epci' },
                    { label: 'Département', value: 'département', disabled: dataLevel == 'epci' },
                ] satisfies { label: string; value: GeoLevel; disabled?: boolean }[]}
                style={{margin:8}}
                onChange={(value) => {
                    //@ts-ignore
                    setLevel(value); // string
                }}
            />
        <Map 
            dataset={level == 'commune' ? joined : level == 'epci' ? agg_epci : agg_dep} 
            valueKey="valeur" 
            unit={unit}
            highlightProperty={highlightProperty}
            interpolationMethod={interpolationMethod} 
            nClasses={nClasses} 
            color={color}
            popup/>
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