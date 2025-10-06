import { Dashboard, Dataset, Filter, Map, Palette, Producer, Transform } from "@geo2france/api-dashboard/dsl"

export const PageMap:React.FC = ({}) => {
    return (
        <Dashboard debug>
            <Palette steps={['#D5C3FB','#5E8C5C','#D4EACA','#F19E38','#745017']}/>
            <Dataset
                id="dechetterie"
                resource='odema:dechetterie'
                url='https://www.geo2france.fr/geoserver/ows'
                type='wfs'
                pageSize={1000}
                meta={{srsname:'EPSG:4326'}}
            ></Dataset>

            <Dataset
                id="ref_epci_odema"
                resource='odema:territoire_epci'
                url='https://www.geo2france.fr/geoserver/ows'
                type='wfs'
                pageSize={1000}
                meta={{srsname:'EPSG:4326'}}
            >
                <Filter field='annee'>2024</Filter>
                <Transform>{data => data.map((d) => ({cat: d.population > 1e5 ? 'grand' : 'petit', ...d})) }</Transform>
            </Dataset>

            <Dataset 
                id='scot'
                resource="scot_en_cours"
                url='https://qgisserver.hautsdefrance.fr/cgi-bin/qgis_mapserv.fcgi?MAP=/var/www/data/qgis/applications/limites_admin.qgz'
                type='wfs'
                pageSize={50}
                meta={{srsname:'EPSG:4326'}}
                >
                <Producer url="https://opendata.hautsdefrance.fr/dataset/ee965118-2416-4d48-b07e-bbc696f002c2">Région Hauts-de-France</Producer>
            </Dataset>

            <Dataset 
                id="points_apport"
                type="datafair"
                resource="donnees-eo-ocab/lines"
                url="https://data.pointsapport.ademe.fr/data-fair/api/v1/datasets"
                pageSize={500}
            >
                <Producer url="https://data.pointsapport.ademe.fr/datasets/donnees-eo-ocab">OCAB</Producer>
            </Dataset>

            <Map dataset="scot" categoryKey="etat_proc" title="Les SCOT des Hauts-de-France"/>

            <Map dataset="points_apport" categoryKey="type_de_point_de_collecte" title="Les points de collecte" xKey="longitudewgs84" yKey="latitudewgs84" popup/>


        </Dashboard>
    )
}