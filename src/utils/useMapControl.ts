// Ajouter un control (element HTML) sur une carte

import { useEffect } from "react";
import { createRoot } from 'react-dom/client';
import  { ControlPosition} from 'react-map-gl/maplibre';

interface useMapControlProps {
    mapRef:React.MutableRefObject<any>
    legendElement : React.ReactElement
    position?: ControlPosition
}
/** A déprécier ? utiliser plutôt le composant LegendControl ?
 * Uniquement pour legacy
 */
export const useMapControl = ({mapRef, legendElement, position='top-right'}:useMapControlProps) => {

    useEffect(() => {
        if (mapRef?.current) {

            const controlDiv = document.createElement('div');
            const root = createRoot(controlDiv);


            const customControl = {
                onAdd: () => {
                    root.render(legendElement);
                    return controlDiv;
                },
                onRemove: () => {
                    controlDiv.parentNode?.removeChild(controlDiv);
                }
            };

            mapRef?.current?.getMap().addControl(customControl, position);

            return () => {
                customControl.onRemove(); 
            };
        }

    }, [mapRef?.current]);
}