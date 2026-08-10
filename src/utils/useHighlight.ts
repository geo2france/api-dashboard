/** Hook permettant de partager une feature en surbrillance 
 * On utilise le mécanisme des controles pour partager un objet contenant
 * le nom de la propriété et la valeur de l'entité à surbriller
 */

import { useContext } from "react"
import { ControlContext, useControl } from "../components/Control/Control"

interface feature_filter {
    property: string,
    value?: any
}

export const useHighlight = ():feature_filter => {
    const f = useControl('highligt') as feature_filter
    return f
}




/** Définir une entité à surbriller */
export const useSetHighlight = (f:feature_filter) => {

    const controlesRegistry = useContext(ControlContext)
    controlesRegistry?.register( {name: 'highligt', value: f } )

}