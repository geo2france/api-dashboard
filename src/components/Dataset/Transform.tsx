import { SimpleRecord } from "../..";


interface ITransformProps {
    /**
   * Contenu du Transform :
   * - **string** : SQL (interprété par Alasql)
   * - **fonction** `(data: any) => SimpleRecord[]` : transforme les données brutes ou déjà transformées
   *   en un tableau de `SimpleRecord`.
   */
    children:string | ((data: any ) => SimpleRecord[])
}

/**
 * Composant permettant d'appliquer une transformation à un jeu de données.
 * La transformation est appliquée via une fonction ou une chaîne SQL. 
 */
export const Transform:React.FC<ITransformProps> = () => {
    return <></>

}
