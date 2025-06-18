import { CrudOperators } from "../../data_providers/types"

interface IFilterProps {
    field: string
    children?: string //Valeur du filtre
    control?: string //Nom du control qui porte la valeur
    operator?: Exclude<CrudOperators, "or" | "and">; //Opérateur de comparaison (default eq, cf liste https://github.com/geo2france/api-dashboard/blob/b9c1ddb511f6bf722704b4935160eacdcfe33cc2/src/data_providers/types.ts#L21-L45)

}

export const DSL_Filter:React.FC<IFilterProps> = ({children, field, control: control_in, operator = "eq"}) => {
    return <></>
}
