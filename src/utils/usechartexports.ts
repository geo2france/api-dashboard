import { MutableRefObject, useEffect, useState } from "react";
import { theme } from "antd";

export interface useChartExportProps{
    chartRef?:MutableRefObject<any>,
  }

/**
 * Fonction pour obtenir l'export (img64) d'un echarts ou d'un maplibre
 * @param ref - Référence de l'objet (echarts ou maplibre)
 * @param backgroundColor - Couleur de fond pour l'export ECharts
 * @returns - L'image en base64
 */
const getDataURL = (ref:MutableRefObject<any>, backgroundColor: string) => {
    if('getCanvas' in ref.current){ //maplibre
        return ref.current.getCanvas().toDataURL();
    }else if ('getEchartsInstance' in ref.current){ //Echart
        return ref.current.getEchartsInstance().getDataURL({backgroundColor});
    }
}


/**
 * Hook personnalisé pour exporter une image à partir d'une instance ECharts.
 * @param {Object} props - Les propriétés du hook.
 * @param {MutableRefObject<any>} props.chartRef - La référence de l'instance ECharts.
 * @returns {Object} - Un objet contenant l'URL de l'image générée et la fonction pour déclencher l'export.
 * 
 * @exemple
 * const {img64, exportImage} = useChartExport({chartRef:chartRef})
 */
export const useChartExport = ( {chartRef}:useChartExportProps) => {
    const [img64, setImage64] = useState()
    const [exportRequested, setExportRequested] = useState(false);
    const { token } = theme.useToken();

    useEffect(() => {
        if (chartRef?.current && exportRequested) {
            const dataURL = getDataURL(chartRef, token.colorBgContainer)
            setImage64(dataURL);
            setExportRequested(false);
        }              
        }, [chartRef, exportRequested]
    )

    const exportImage = () => {
        setExportRequested(true);
    };
    return { img64, exportImage}
}
