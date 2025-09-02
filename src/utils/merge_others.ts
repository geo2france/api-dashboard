import { from, op } from "arquero";
import { SimpleRecord } from "../types"

interface MergeOthersOpts {
    dataset:SimpleRecord[]
    min:number
    other_cat_name?:string
}

export const merge_others = ({ dataset, min, other_cat_name = 'Autres' }: MergeOthersOpts): SimpleRecord[] => {
    const total = dataset.reduce((acc, d) => acc + d.value, 0);

    const small = dataset.filter(d => (d.value / total) * 100 < min);
    const large = dataset.filter(d => (d.value / total) * 100 >= min);

    if (small.length > 1) {
        const others_row = from(small).rollup({value:op.sum('value')}).objects().map((d:SimpleRecord)=> ({
            name: other_cat_name,
            value: d.value
        }))
        return [...large, ...others_row]
    }
    return dataset
}