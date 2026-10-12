/** Hook permettant de partager une feature en surbrillance 
 * On utilise le mécanisme des controles pour partager un objet contenant
 * le nom de la propriété et la valeur de l'entité à surbriller
 */

import { useCallback, useContext, useRef } from "react"
import { ControlContext } from "../components/Control/Control"
import EChartsReact from "echarts-for-react";

interface feature_filter {
    property: string,
    value: any | null
}


/** Récupérer l'entité à surbriller */
export const useHighlight = ():feature_filter => {

    const controlesRegistry = useContext(ControlContext);

    return controlesRegistry?.values.highlight
}




/** Définir une entité à surbriller */
export const useSetHighlight = () => {

    const lastHighlight = useRef<feature_filter>();

  // On utilise le mécanisme des contrôles. Il s'agit d'un contrôle
  // caché nommé 'highlight'
  const controlesRegistry = useContext(ControlContext); 

  return useCallback((f: feature_filter) => {

    //Avoid unnecessary rerender
    if (
      lastHighlight.current?.property === f.property &&
      lastHighlight.current?.value === f.value
    ) {
      return;
    }

    lastHighlight.current = f;
    controlesRegistry?.register({ highlight : f });
  }, [controlesRegistry]);
};



interface useApplyEchartsHighlightProps {
    /** Référence du graphique */
    chartRef: React.RefObject<EChartsReact>,

    /** Définir manuellement un dataname à mettre en surbrillance (défaut : auto) */
    name?: string
}

/** Hook helper permettant d'appliquer une surbrillance sur un élement d'un graphique Echarts
 * La surbrillance se base sur le nom des itemps Echarts. Le nom peut être définie soit :
 * - Avec encode (https://echarts.apache.org/en/option.html#series-line.encode)
 * - En définissant les données comme {name:'a', values:[5, 'b']}
 * @experimental
*/
export const useApplyEchartsHighlight = ({chartRef, name}: useApplyEchartsHighlightProps) => {

    //devnote : traiter ici aussi les remontées de surbrillance ? (a partir des event du charts)

    const auto_highlighted = useHighlight();

    const highlighted = name ? {value:name} : auto_highlighted;

    const echartsInstance = chartRef.current?.getEchartsInstance()
    try { // Non critique, ca ne doit pas faire crasher l'application

        //Release existing highlight
        echartsInstance?.dispatchAction({type:"downplay"})

        highlighted?.value && echartsInstance?.dispatchAction({
            type: 'highlight',
            name: highlighted.value,
        })

    }
    catch(error) {
        console.warn('Impossible d’appliquer le highlight ECharts', error);
    }
}