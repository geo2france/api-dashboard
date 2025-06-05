import { useContext, useEffect } from "react";
import { SimpleRecord } from "../..";
import alasql from "alasql";
import { DataContext } from "./Dataset";

interface ITransformProps<T = SimpleRecord[]> {
    children:string | ((data: T) => T)
}

export const DSL_Transform:React.FC<ITransformProps> = ({children}) => {
    const dataContext = useContext(DataContext)
    const data = dataContext?.data;

    const isFunction = (value: any): value is Function => typeof value === 'function';
    
    useEffect( () => {
        if (typeof children === 'string') { // Transformation via une requête SQL
            //console.log('Children is a string:', children);
            const new_data = data && alasql(children, [data]) as SimpleRecord[]
            data && dataContext?.setData(new_data)
        } else if (isFunction(children)) { //Transformation des données via une fonction JS
            //console.log('Use JS transformer');
            data && dataContext?.setData(children(data))
        } else {
                throw new Error(
                    `Transform children must be either a string or a function, got: ${typeof children}`
                );
        } }, [data, children]
    )

    return <></>

}
