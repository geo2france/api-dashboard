import { useCallback, useContext, useEffect, useId } from "react";
import { SimpleRecord } from "../..";
import alasql from "alasql";
import { TransformContext } from "./Dataset";

interface ITransformProps<T = SimpleRecord[]> {
    children:string | ((data: T) => T)
}
/*
* Le composant Transform enregistre une fonction dans le contexte du dataset. Cette fonction sera appliqué aux données.
* Si plusieurs Transform sont instanciés, les fonctions sont appliquées successivement.
*/
export const DSL_Transform:React.FC<ITransformProps> = ({children}) => {
    //Utiliser la fonction fournie dans ce contexte pour ajouter la fonction transformers au dataset
    const transformContext = useContext(TransformContext) 
    const transformer_id = useId()

    const isFunction = (value: any): value is Function => typeof value === 'function';
    
    const transformer = useCallback(() => { // Callback pour stabiliser la référence à la fonction, même en cas de rendu multiple
        if (typeof children === 'string') { // Transformation via une requête SQL
            return (data:SimpleRecord[]) => alasql(children, [data]) as SimpleRecord[]
        }  else if (isFunction(children)) { 
            return (data:SimpleRecord[]) => children(data)
        } else {
            throw new Error(
                `Transform children must be either a string or a function, got: ${typeof children}`
              );
        }
    }, [children])

    useEffect(() => {
        const fn = transformer();
        transformContext.addTransformer(transformer_id,fn);
      }, [transformer, transformContext.addTransformer, transformer_id ]);
    

    return <></>

}
