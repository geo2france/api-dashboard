export type joinTypeType = 'left' | 'right' | 'full' | 'inner'

interface IJoinProps {
   joinKey : string | [string, string]
   dataset: string
   joinType?: joinTypeType
}
/*
* Les props sont utilisées dans le Dataset parent pour appliquer la jointure
*/
export const Join:React.FC<IJoinProps> = () => {
    return <></>

}
