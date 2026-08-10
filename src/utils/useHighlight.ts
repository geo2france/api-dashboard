/** Hook permettant de partager une feature en surbrillance 
 * On utilise le mécanisme des controles pour partager un objet contenant
 * le nom de la propriété et la valeur de l'entité à surbriller
 */

import { useCallback, useContext } from "react"
import { ControlContext } from "../components/Control/Control"

interface feature_filter {
    property: string,
    value: any | null
}

export const useHighlight = ():feature_filter => {
   // const f = useControl('highlight') as feature_filter

    const controlesRegistry = useContext(ControlContext);

    const f = controlesRegistry?.values.highlight
    console.log('geted feature', controlesRegistry?.values)
    return f
}




/** Définir une entité à surbriller */
export const useSetHighlight = () => {
  const controlesRegistry = useContext(ControlContext);

  return useCallback((f: feature_filter) => {
    console.log('registerd value', f)
    controlesRegistry?.register({ highlight : f });
  }, [controlesRegistry]);
};