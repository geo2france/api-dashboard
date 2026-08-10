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


/** Récupérer l'entité à surbriller */
export const useHighlight = ():feature_filter => {

    const controlesRegistry = useContext(ControlContext);

    return controlesRegistry?.values.highlight
}




/** Définir une entité à surbriller */
export const useSetHighlight = () => {

  // On utilise le mécanisme des contrôles. Il s'agit d'un contrôle
  // caché nommé 'highlight'
  const controlesRegistry = useContext(ControlContext); 

  return useCallback((f: feature_filter) => {
    controlesRegistry?.register({ highlight : f });
  }, [controlesRegistry]);
};