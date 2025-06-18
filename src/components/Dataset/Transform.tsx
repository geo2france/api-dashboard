import { SimpleRecord } from "../..";


interface ITransformProps<T = SimpleRecord[]> {
    children:string | ((data: T) => T)
}
/*
* Les props sont utilisées dans le Dataset parent pour appliquer une (ou plusieurs fonction de transformation)
*/
export const DSL_Transform:React.FC<ITransformProps> = () => {
    return <></>

}
