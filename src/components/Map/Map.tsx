// Composant carto
import  Maplibre, { Layer, LayerProps, Source, SourceProps, useMap, Popup, NavigationControl } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import { useEffect, useMemo, useRef, useState } from "react"
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
import { theme } from 'antd';




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

  /** Longitude du centre de la carte */
  longitude?: number;

  /** Latitude du centre de la carte */
  latitude?: number;

  /** Zoom initial */
  zoom?: number;

}

/** _Beta_ : Un composant permettant un affichage cartographique d'un jeu de données 
 * 
 * Permet l'affichage de données type "Polygon".
 * 
 * Si `valueKey` est définie, les couleurs seront calculées à partir de la colonne indiquée (quantitative ou qualitative).
 * 
*/
export const Map:React.FC<MapProps> = ({dataset, color, paint, categoryKey, interpolationMethod, valueKey:valueKeyInput, labelKey,
        popup = false, popupFormatter:popupFormatterUser, 
        title, xKey, yKey,
        latitude=0, longitude=0, zoom=0, fitToData}) => {

    const valueKey = valueKeyInput || categoryKey;

    const mapRef = useRef<MapRef>(null);


    const [clickedFeature, setClickedFeature] = useState<any>(undefined);

    useBlockConfig({title:title})

    const onClickMap = (evt:any) => {
       setClickedFeature({...evt.features[0], ...{lngLat:evt.lngLat}})
    }

    const current_row = clickedFeature?.properties

    const popupFormatter =
        popupFormatterUser || // user definied function
        // or show all props (fallback)
        ((row: Record<string, any>) => ( 
            <>
            {Object.entries(row)
            .filter(([key]) => !["geometry", "geom", "id", "geometry_name", "bbox"].includes(key))
            .map(([key, value]) => (
                <div key={key}>
                <strong>{key}</strong> : {String(value)}
                </div>
            ))}
            </>
        ));

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
    
    const mapStyle = useMemo(() => ({
        version: 8 as const,
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",  //devnote : intégrer le pbf dans le projet ?
        sources: {},
        layers: []
    }), [])

    return (
        <Maplibre 
          cooperativeGestures
          locale={map_locale}
          ref={mapRef} 
          interactiveLayerIds={[dataset]} 
          onClick={onClickMap}  
          onMouseMove={onMouseMoveMap}
          initialViewState={{latitude:latitude, longitude:longitude, zoom:zoom}}
          mapStyle={mapStyle}
          style={{ width: '100%', height:'500px' }} 
          >
            <NavigationControl showCompass={false} showZoom={true}/>
            <BaseLayer layer="osm"/>

            <MapLayer 
                dataset={dataset} fitToData={fitToData}
                color={color} paint={paint} interpolationMethod={interpolationMethod}
                valueKey={valueKey} labelKey={labelKey} xKey={xKey} yKey={yKey} />
            
            { clickedFeature?.properties && popup &&
                <Popup longitude={clickedFeature.lngLat.lng} 
                        latitude={clickedFeature.lngLat.lat} 
                        closeOnClick={false}
                        onClose={() => {setClickedFeature(null)} }>
                    <div>{ popupFormatter(current_row) }</div>
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

    /** Colonne contenant l'étiquette */
    labelKey?: string

    /** Méthode d'interpolation utilisé pour les valeurs numériques*/
    interpolationMethod?: interpolationType

    /** Colonne contenant la coordonnée x / longitude. A utiliser s'il n'y a pas de colonne de geometrie. */
    xKey?: string

    /** Colonne contenant la coordonnées y / latitude. A utiliser s'il n'y a pas de colonne de geometrie. */
    yKey?: string

     /** Colonne contenant la geométrie au format GeoJSON(4326). Par défaut détection automatique ("geom" ou "geometry") */
    geomKey?: string

    /** Centrer automatiquement la carte sur les données (true) */
    fitToData?: boolean;

}


/**
 * Composant à utiliser comme enfant d'une <Map>
 * Ajoute une couche (layer) à partir d'un dataset
 * 
 * @param { MapLayerProps } props 
 * @returns { ReactElement }
 */
export const MapLayer:React.FC<MapLayerProps> = ({
        dataset, valueKey:valueKeyInput, categoryKey, labelKey,
        interpolationMethod='quantile', color = '#00b4d8', paint, 
        xKey, yKey, geomKey:geomKey_input,
        fitToData=true }) => {

    const {current: map} = useMap();

    const valueKey = valueKeyInput || categoryKey ;
    const data = useDataset(dataset)
    const { token } = theme.useToken();
    // src (lib proj4 pour convertir)

    const keys = data?.data?.[0] ? Object.keys(data?.data?.[0]) : undefined

    const geomKey = [geomKey_input,"geom","geometry"].find(c => c && keys?.includes(c))

    // Si x et y sont definie, on construit le geojson
    const geojson = useMemo(() => {
        if (xKey && yKey && data?.data) {
            return build_geojson({
                data: data.data,
                xKey,
                yKey
            });
        }

        if (data?.data) {
            return build_geojson({
                data: data.data,
                geomKey
            });
        }

        return undefined;

    }, [data?.data, xKey, yKey, geomKey]);

    const geom_type = geojson?.features?.[0] && getType(geojson?.features?.[0]);

    /* Type de données dans valueKey (string ou number) */
    const type_value = valueKey && typeof (data?.data?.[0]?.[valueKey])


    /* Valeurs distinctes (si type string) */
    const values = (type_value === 'string') && valueKey && data?.data && from(data?.data).rollup({ a: op.array_agg_distinct(valueKey) }).get('a',0) || undefined

    /* Gradient de couleur (si number) */
    const colorsGradient = type_value==="number" ? generateGradient(color) : undefined ;

    //devnote : ajouter un usememo pour limiter ?
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
            <Layer key={dataset + '_line'}id={dataset + '_line'} type='line' paint={{"line-width":0.5,"line-color": token.colorBgContainer}}/>
        )

    } 
    /** LINESTRING */ 
    else if (geom_type === 'LineString' || geom_type === 'MultiLineString') {
        const default_paint:LinePaint = { "line-color": expression ?? color ?? colors![0]  }
        layers.push(
            <Layer key={dataset} id={dataset} type="line" paint={(paint ?? default_paint) as any} />
        )
    }

    if(labelKey) {
        layers.push(
         <Layer
            key={dataset + '_label'}
            id={dataset + '_label'}
            type="symbol"
            layout={{
                "text-field": ["coalesce", ["get", labelKey], ""],
                "text-size": 12,
                "text-anchor": "center",
                "text-allow-overlap": false
            }}
            paint={{
                "text-color": "#000",
                "text-halo-color": "#fff",
                "text-halo-width": 1
            }}
        />
       )
    }

    useEffect( () => {
        if(fitToData && geojson && geojson.features.length > 0){ // do not fitbound if no features
            const box = bbox(geojson).slice(0,4) as [number, number, number, number]
            map?.fitBounds(box, {padding: 20, animate: false })
        }
    }, [geojson, map, fitToData])

    return (
       <>
        { geojson && 
            <Source type="geojson" data={geojson} >
                { layers }
            </Source> 
        }
           {legendItems.length > 0 && <LegendControl items={legendItems} /> }
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