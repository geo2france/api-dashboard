import { forwardRef, useImperativeHandle, useRef } from 'react';
import { theme } from 'antd';
import { EChartsOption } from "echarts"
import EChartsReact from "echarts-for-react"
import { usePalette } from "../Palette/Palette"
import deepMerge from "../../utils/deepmerge"

const { useToken } = theme;


interface ChartEchartsProps {
    option?:EChartsOption,
}

/*
* Ce composant peut servir de base aux développements d'autres composants ou être utilisé directement dans une page (non conseillé).
* - Applique la palette utilisateur
* - Utilise le style de texte de l'application
* devnote : A partir de React 19, ne plus utiliser forwardRef https://react.dev/reference/react/forwardRef
*/

export const ChartEcharts = forwardRef<EChartsReact, ChartEchartsProps>(({ option = {} }, ref) =>  {
    const innerRef = useRef<EChartsReact>(null)
    useImperativeHandle(ref, () => innerRef.current as EChartsReact, []) // Pour exposer le innerref au parent

    const { token } = useToken();

    const n_series = Array.isArray(option.series) ? option.series?.length : 1

    // Récupérer et traduire les éléments depuis le theme antdesign : police, couleurs, etc..
    // Ceci peut-être surchargé par les options de l'utilisateur
    const default_option: Partial<EChartsOption> = {
        color: usePalette({nColors:n_series}),
        textStyle: {
             fontFamily : token.fontFamily,
             color: token.colorTextSecondary
        },
        xAxis: {
            axisLine: { lineStyle: { color:  token.colorTextSecondary } },
          },
        yAxis: {
            axisLine: { lineStyle: { color: token.colorTextSecondary } },
        },
    }
    return (
        <EChartsReact 
            option={ deepMerge({}, default_option, option) } 
            ref={innerRef}
        />
    )
})
