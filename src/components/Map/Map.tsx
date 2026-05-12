// Composant carto
import  Maplibre, { Layer, LayerProps, Source, SourceProps, useMap, Popup } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import { useEffect, useRef, useState } from "react"
import { useDataset } from '../Dataset/hooks';
import bbox from '@turf/bbox';
import { getType} from '@turf/invariant'
import { feature, featureCollection, point } from '@turf/helpers'
import { AnyPaint, CirclePaint, Expression, FillPaint, LinePaint } from 'mapbox-gl';
import React from 'react';
import { usePalette, usePaletteLabels } from '../Palette/Palette';
import { from, op } from 'arquero';
import { LegendControl, LegendItem } from '../MapLegend/MapLegend';
import { useBlockConfig } from '../DashboardPage/Block';
import { SimpleRecord } from '../../types';
import { parseNumber } from '../../utils/parsers';
import { FeatureCollection } from 'geojson';
import {  scaleLinear, scaleQuantile } from 'd3-scale';
import { generateGradient } from './utils';




/** Méthode d'interpolation utilisé pour les valeurs numériques */
type interpolationType = "linear" | "quantile" ;

export const map_locale = {
    'CooperativeGesturesHandler.WindowsHelpText': 'Utilisez Ctrl + molette pour zommer sur la carte.',
    'CooperativeGesturesHandler.MacHelpText': 'Utilisez ⌘ + molette pour zommer sur la carte.',
    'CooperativeGesturesHandler.MobileHelpText': 'Utilisez deux doights pour déplacer la carte.',
}


/** Construire un geojson a partir d'un tableau de données*/
const build_geojson = (params: {
  data: SimpleRecord[];   // dataset contient un tableau d'enregistrements
  xKey?: string ;
  yKey?: string;
  geomKey?: string;
}): FeatureCollection | undefined => {

    const { data, xKey, yKey, geomKey } = params;
    let features_collection
    if (xKey && yKey){ // Construction à partir des champs x et Y
        features_collection = featureCollection( data.map((e:SimpleRecord) => {
            const [x, y] = [ parseNumber(e[xKey] ), parseNumber(e[yKey] ) ]
            return point([x, y],  {...e}  ) 
        }) )
    }else if(geomKey){ // Construction à partir de la GeomGeoJSON
        features_collection = featureCollection( data.map((e:SimpleRecord) => {
            return feature(e[geomKey],  {...e}  ) 
        }) )
    }else{
        features_collection = undefined
    }
    return features_collection
}


/**
 * Une carto simple avec un layer
 * 
 *  */

interface MapProps extends MapLayerProps {
  /** Afficher une popup après un click sur la carte */
  popup?: boolean;

  /** Fonction callback permettant de définir le contenu de la popup */
  popupFormatter?: ((param: SimpleRecord) => React.ReactNode);

  /** Titre du graphique */
  title?: string;
}

/** _Beta_ : Un composant permettant un affichage cartographique d'un jeu de données 
 * 
 * Permet l'affichage de données type "Polygon".
 * 
 * Si `valueKey` est définie, les couleurs seront calculée à partir de la colonne indiquée (quantitative ou qualitative).
 * 
*/
export const Map:React.FC<MapProps> = ({dataset, color, paint, categoryKey, interpolationMethod, valueKey:valueKeyInput, 
    popup = false, popupFormatter:popupFormatterUser, 
    title, xKey, yKey}) => {

    const valueKey = valueKeyInput || categoryKey;

    const mapRef = useRef<MapRef>(null);
    const [clickedFeature, setClickedFeature] = useState<any>(undefined);

    useBlockConfig({title:title})

    const onClickMap = (evt:any) => {
       setClickedFeature({...evt.features[0], ...{lngLat:evt.lngLat}})
    }

    const current_row = clickedFeature?.properties

    const popupFormatter = popupFormatterUser || ((row:SimpleRecord) => valueKey ? row?.[valueKey] : undefined)

    const onMouseMoveMap = (evt:any) => {
        if (!mapRef.current) {
            return
        }
        if (evt?.features.length > 0 && popup) {
            mapRef.current.getCanvasContainer().style.cursor = 'pointer'
        }else {
            mapRef.current.getCanvasContainer().style.cursor = 'grab'
        }
  }

    return (
        <Maplibre 
          cooperativeGestures
          locale={map_locale}
          ref={mapRef} 
          interactiveLayerIds={[dataset]} 
          onClick={onClickMap}  
          onMouseMove={onMouseMoveMap} 
          style={{ width: '100%', height:'500px' }} >

            <BaseLayer layer="osm"/>

            <MapLayer dataset={dataset} color={color} paint={paint} valueKey={valueKey} xKey={xKey} yKey={yKey} interpolationMethod={interpolationMethod}></MapLayer>
            
            { clickedFeature?.properties && valueKey && popup &&
                <Popup longitude={clickedFeature.lngLat.lng} 
                        latitude={clickedFeature.lngLat.lat} 
                        closeOnClick={false}
                        onClose={() => {setClickedFeature(null)} }>
                    <div>{ popupFormatter(current_row) || clickedFeature?.properties[valueKey] }</div>
                </Popup> 
            }

        </Maplibre>
        )
}


interface MapLayerProps {
    /** Identifiant du jeu de données */
    dataset: string

    /** Couleur des symboles */
    color?:string

    /** Les paint properties de maplibre cf. https://maplibre.org/maplibre-style-spec/layers/#paint */
    paint?:AnyPaint

    /** Colonne contenant la variable à représenter 
     * @deprecated
    */
    categoryKey?: string

    /** Colonne contenant la variable à représenter 
     * Quantitative (number) ou qualitative (string)
     */
    valueKey?: string

    /** Méthode d'interpolation utilisé pour les valeurs numériques*/
    interpolationMethod?: interpolationType

    /** Colonne contenant la coordonnée x / longitude. A utiliser s'il n'y a pas de colonne de geometrie. */
    xKey?: string

    /** Colonne contenant la coordonnées y / latitude. A utiliser s'il n'y a pas de colonne de geometrie. */
    yKey?: string

     /** Colonne contenant la geométrie au format GeoJSON(4326). Par défaut détection automatique ("geom" ou "geometry") */
    geomKey?: string
}


/**
 * Composant à utiliser comme enfant d'une <Map>
 * Ajoute une couche (layer) à partir d'un dataset
 * 
 * @param { MapLayerProps } props 
 * @returns { ReactElement }
 */
export const MapLayer:React.FC<MapLayerProps> = ({dataset, valueKey:valueKeyInput, interpolationMethod='quantile', categoryKey, color = '#00b4d8', 
    paint, xKey, yKey, geomKey:geomKey_input}) => {
    const {current: map} = useMap();

    const valueKey = valueKeyInput || categoryKey ;
    const data = useDataset(dataset)
    // src (lib proj4 pour convertir)

    const keys = data?.data?.[0] ? Object.keys(data?.data?.[0]) : undefined

    const geomKey = [geomKey_input,"geom","geometry"].find(c => c && keys?.includes(c))

    // Si x et y sont definie, on construit le geojson
    const geojson = xKey && yKey && data?.data ? 
        build_geojson({data:data.data, xKey:xKey, yKey:yKey})
        :  data?.data && build_geojson({data:data?.data, geomKey:geomKey})

    const geom_type = geojson?.features?.[0] && getType(geojson?.features?.[0]);

    /* Type de données dans valueKey (string ou number) */
    const type_value = valueKey && typeof (data?.data?.[0]?.[valueKey])


    /* Valeurs distinctes (si type string) */
    const values = (type_value === 'string') && valueKey && data?.data && from(data?.data).rollup({ a: op.array_agg_distinct(valueKey) }).get('a',0) || undefined

    /* Gradient de couleur (si number) */
    const colorsGradient = type_value==="number" ? generateGradient(color) : undefined ;

    const breaks =
        colorsGradient && data?.data && valueKey
            ? (() => {
                switch (interpolationMethod) {
                case "linear":
                    return scaleLinear(data.data.map((d) => d[valueKey]), colorsGradient  ).ticks(colorsGradient.length -1 ).sort((a, b) => a - b)

                case "quantile":
                    return scaleQuantile(data.data.map((d) => d[valueKey]), colorsGradient  ).quantiles().sort((a, b) => a - b)

                default:
                    return undefined;
                }
            })()
            : undefined;
 
    /** Couleurs de la palette */
    const colors = usePalette({nColors:Array.isArray(values) ? values?.length : 1})
    const colors_labels = usePaletteLabels()

    const match = Array.isArray(values) ? values?.map((v, i) => ({
        val: v,
        color: colors_labels.find( i => i.label.toLowerCase() == v.toLowerCase() )?.color ?? colors?.[i],
    })) : undefined ;

    /** Expression mapLibre qui permet de mapper les valeurs et les couleurs de la palette */
    const expression: Expression | undefined = 
        match && valueKey //Qualitatif
            ? [
                "match",
                ["get", valueKey],
                ...match?.flatMap( (s) => [s.val, s.color]), 
                "purple" // fallback
            ] as Expression
    : breaks && colorsGradient && type_value==="number" && valueKey ? // Quantitatif
        [
        "step",
        ["get", valueKey],
        colorsGradient[0],
        ...breaks.flatMap((b, i) => [b, colorsGradient[i + 1]])
        ]
    : undefined;

    const legendItems:LegendItem[] = type_value === "string" ? 
        match?.map((e) => ({color:e.color, label:e.val})).sort((a, b) =>
            a.label.localeCompare(b.label)) || [] 
        : colorsGradient && breaks?.flatMap((b, i) => ({label:b.toLocaleString(undefined, {maximumFractionDigits:0}), color:  colorsGradient[i + 1]})) || []


    const layers = [];
    /** POINT */
    if (geom_type === 'Point' || geom_type === 'MultiPoint') {
        const default_paint:CirclePaint = {"circle-color": expression ?? color ?? colors![0] }
        layers.push(
            <Layer key={dataset} id={dataset} type="circle" paint={(paint ?? default_paint) as any}  />
        )
    }
    /** POLYGON */ 
    else if (geom_type === 'Polygon' || geom_type === 'MultiPolygon') {     
        const default_paint:FillPaint = { "fill-color" : expression ?? color ?? colors![0] }
        layers.push(
            <Layer key={dataset} id={dataset} type="fill" paint={(paint ?? default_paint) as any}/>
        )
        layers.push(
            <Layer key={dataset + '_line'}id={dataset + '_line'} type='line' paint={{"line-width":0.5,"line-color":'#fff'}}/>
        )
    } 
    /** LINESTRING */ 
    else if (geom_type === 'LineString' || geom_type === 'MultiLineString') {
        const default_paint:LinePaint = { "line-color": expression ?? color ?? colors![0]  }
        layers.push(
            <Layer key={dataset} id={dataset} type="line" paint={(paint ?? default_paint) as any} />
        )
    }

    //devnote : regarder la colonne contenant les valeurs pour proposer une représentation (catégorie ou choroplèthe)

    useEffect( () => {
        if(geojson && geojson.features.length > 0){ // do not fitbound if no features
            const box = bbox(geojson).slice(0,4) as [number, number, number, number]
            map?.fitBounds(box, {padding: 20 })
        }
    }, [geojson, map])

    return (
       <>
        { geojson && 
            <Source type="geojson" data={geojson} >
                { layers }
            </Source> 
        }
           <LegendControl items={legendItems} /> 
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