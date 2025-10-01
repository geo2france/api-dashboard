// Composant carto
import  Maplibre, { Layer, LayerProps, Source, SourceProps, useMap, Popup } from 'react-map-gl/maplibre';
import type {MapRef, AnyLayer  } from 'react-map-gl/maplibre';
import { useEffect, useRef, useState } from "react"
import { useDataset } from '../Dataset/hooks';
import bbox from '@turf/bbox';
import { getType } from '@turf/invariant'
import { AnyPaint, CirclePaint, Expression, FillPaint, LinePaint } from 'mapbox-gl';
import React from 'react';
import { usePalette } from '../Palette/Palette';
import { from, op } from 'arquero';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LegendControl, LegendItem } from '../MapLegend/MapLegend';
import { useBlockConfig } from '../DashboardPage/Block';



type LayerType = AnyLayer["type"]; 

export const map_locale = {
    'CooperativeGesturesHandler.WindowsHelpText': 'Utilisez Ctrl + molette pour zommer sur la carte.',
    'CooperativeGesturesHandler.MacHelpText': 'Utilisez ⌘ + molette pour zommer sur la carte.',
    'CooperativeGesturesHandler.MobileHelpText': 'Utilisez deux doights pour déplacer la carte.',
}

/**
 * Une carto simple avec un layer
 * 
 *  */

interface MapProps extends MapLayerProps {
  /** Afficher une popup après un click sur la carte */
  popup?: boolean;

  /** Titre du graphique */
  title?: string;
}

export const Map:React.FC<MapProps> = ({dataset, color, type, paint, categoryKey, popup = false, title}) => {
    const mapRef = useRef<MapRef>(null);
    const [clickedFeature, setClickedFeature] = useState<any>(undefined);

    useBlockConfig({title:title})

    const onClickMap = (evt:any) => {
       setClickedFeature({...evt.features[0], ...{lngLat:evt.lngLat}})
    }

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

            <MapLayer dataset={dataset} color={color} type={type} paint={paint} categoryKey={categoryKey}></MapLayer>
            
            { clickedFeature?.properties && categoryKey && popup &&
                <Popup longitude={clickedFeature.lngLat.lng} 
                        latitude={clickedFeature.lngLat.lat} 
                        onClose={() => {setClickedFeature(null)} }>
                    <div> {clickedFeature.properties[categoryKey]} </div> {/** Afficher toutes les props ? */}
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

    /** Layer Type */
    type?:LayerType

    /** Les paint properties de maplibre cf. https://maplibre.org/maplibre-style-spec/layers/#paint */
    paint?:AnyPaint

    /** Colonne contenant la variable à représenter */
    categoryKey?: string
}

/**
 * Composant à utiliser comme enfant d'une <Map>
 * Ajoute une couche (layer) à partir d'un dataset
 * 
 * @param { MapLayerProps } props 
 * @returns { ReactElement }
 */
export const MapLayer:React.FC<MapLayerProps> = ({dataset, categoryKey, color = 'red', type='circle', paint}) => {
    const {current: map} = useMap();
    const data = useDataset(dataset)
    //dev note : besoin d'être plus générique pour supporter autre chose que le wfs (le seul fournisseur qui donne du geojson)
    // ajouter en props : x field, y field
    // src (lib proj4 pour convertir)
    // A partir de ces info, on génère un geojson valide

    const geojson = data?.geojson ;
    const geom_type = geojson?.features?.[0] && getType(geojson?.features?.[0]);

    /** Type de données dans categoryKey (string ou number) */
    const type_value = categoryKey && typeof (data?.data?.[0][categoryKey])

    /** Valeurs distinctes (si type string) */
    const values = (type_value === 'string') && categoryKey && data?.data && from(data?.data).rollup({ a: op.array_agg_distinct(categoryKey) }).get('a',0) || undefined

    /** Couleurs de la palette */
    const colors = usePalette({nColors:Array.isArray(values) ? values?.length : 1})


    const match = Array.isArray(values) ? values?.map((v, i) => ({
        val: v,
        color: colors?.[i],
    })) : undefined ;

    /** Expression mapLibre qui permet de mapper les valeurs et les couleurs de la palette */
    const expression: Expression | undefined = 
        match && categoryKey
            ? [
                "match",
                ["get", categoryKey],
                ...match?.flatMap( (s) => [s.val, s.color]), 
                "purple" // fallback
            ] as Expression
    : undefined;

    const legendItems:LegendItem[] = match?.map((e) => ({color:e.color, label:e.val})).sort((a, b) =>
    a.label.localeCompare(b.label)) || []


    const layers = [];
    /** POINT */
    if (geom_type === 'Point' || geom_type === 'MultiPoint') {
        const default_paint:CirclePaint = {"circle-color": expression ?? color ?? colors![0] }
        type = 'circle'
        layers.push(
            <Layer key={dataset} id={dataset} type="circle" paint={(paint ?? default_paint) as any}  />
        )
    }
    /** POLYGON */ 
    else if (geom_type === 'Polygon' || geom_type === 'MultiPolygon') {     
        const default_paint:FillPaint = { "fill-color" : expression ?? color ?? colors![0] }
        type = 'fill'
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
        type = 'line'
        layers.push(
            <Layer key={dataset} id={dataset} type="line" paint={(paint ?? default_paint) as any} />
        )
    }

    //devnote : regarder la colonne contenant les valeurs pour proposer une représentation (catégorie ou choroplèthe)

    useEffect( () => {
        if(geojson){
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