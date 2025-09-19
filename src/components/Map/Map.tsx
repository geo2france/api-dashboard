// Composant carto
import  Maplibre, { Layer, LayerProps, Source, SourceProps, useMap } from 'react-map-gl/maplibre';
import type {MapRef, AnyLayer} from 'react-map-gl/maplibre';
import { ReactElement, useEffect, useRef } from "react"
import { useDataset } from '../Dataset/hooks';
import bbox from '@turf/bbox';
import { AnyPaint } from 'mapbox-gl';

type LayerType = AnyLayer["type"]; 

interface MapProps {
    children? : ReactElement | ReactElement[]
}

/**
 * Un caneva de carto dans lequel on pourra
 * ajouter des layer (un layer s'alimente sur un dataset)
 *  */
export const Map:React.FC<MapProps> = ({children}) => {
    const mapRef = useRef<MapRef>(null);


    return (
        <Maplibre ref={mapRef}>
            <BaseLayer layer="osm"/>
            {children}
        </Maplibre>
        )
}


interface MapLayerProps {
    /** Identifiant du jeu de données */
    dataset: string

    /** Couleur des symboles */
    color?:string

    /** Layer Type */
    type?:LayerType

    /** Les paint properties de maplibre cf. https://maplibre.org/maplibre-style-spec/layers/#paint */
    paint?:AnyPaint
}

/**
 * Composant à utiliser comme enfant d'une <Map>
 * Ajoute une couche (layer) à partir d'un dataset
 * 
 * @param { MapLayerProps } props 
 * @returns { ReactElement }
 */
export const MapLayer:React.FC<MapLayerProps> = ({dataset, color = 'red', type='circle', paint}) => {
    const {current: map} = useMap();
    const data = useDataset(dataset)

    //dev note : besoin d'être plus générique pour supporter autre chose que le wfs (le seul fournisseur qui donne du geojson)
    // ajouter en props : x field, y field
    // src (lib proj4 pour convertir)
    // A partir de ces info, on génère un geojson valide

    let default_paint = {}
    if (type == 'circle') {
        default_paint = {"circle-color":color}
    } // TODO ajouter d'autre défault (fill et line)

    const geojson = data?.geojson ;

    useEffect( () => {
        if(geojson){
            const box = bbox(geojson).slice(0,4) as [number, number, number, number]
            map?.fitBounds(box, {padding: 20 })
        }
    }, [geojson, map])

    return (
       <>
       { geojson && <Source
            type="geojson"
            data={geojson}
        >
            <Layer id={dataset} type={type} paint={paint || default_paint}/>
        </Source> }
        </>
    )
}



export interface IMapBaseLayerProps {
    layer : 'osm' | 'ortho',
    tileSize? : number
}
/**
 * Composant à utiliser comme enfant d'une <Map>
 * Permet d'ajouter un fond de plan (OSM ou orthophoto)
 * devnote : couches spécifiques Hauts-de-France
 * 
 * @param { IMapBaseLayerProps } props 
 * @returns { ReactElement }
 */
export const BaseLayer: React.FC<IMapBaseLayerProps> = ({ layer, tileSize=256 }) => {
    //TODO : ne pas utiliser par défaut le fond de plan geo2france ?
    const t = (() => {
        switch (layer) {
            case 'osm':
                return `https://osm.geo2france.fr/mapcache/?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=false&LAYERS=grey&TILED=true&WIDTH=${tileSize}&HEIGHT=${tileSize}&SRS=EPSG%3A3857&STYLES=&BBOX={bbox-epsg-3857}`
            case 'ortho':
                return `https://www.geo2france.fr/geoserver/geo2france/ows/?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&srs=EPSG:3857&transparent=true&width=${tileSize}&height=${tileSize}&layers=ortho_regionale_2018_rvb`
        }
    })();

    const source_raster:SourceProps = 
    {
      type: 'raster',
      attribution: 'OpenStreetMap', //fixme
      tiles: [
            t
        ],
      tileSize:tileSize
    }; 
  
  const layer_raster:LayerProps = {
    'type': 'raster',
    'paint': {}
  };

    return (
          <Source {...source_raster}>
            <Layer {...layer_raster} />
          </Source>
      );
    }