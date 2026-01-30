import { SimpleRecord } from "../types"
import { from, op } from "arquero"

interface AggregatorParams {
  /** Tableau de données */
  data?: SimpleRecord[]

  /** Colonne à aggréger */
  dataKey?: string

  /** Agregat */
  aggregate: "last" | "first" | "sum" | "lastNotNull" | "min" | "max" | "count" | "mean" | "countDistinct" | "countMissing"
}

interface AggregatorResult {
  /** Ligne retenue (pour "last", "first", "lastNotNull") */
  row?: SimpleRecord  

  /** Valeur agrégée */
  value?: number //ou string ? undef ?
}

/** Fonction permettant d'agréger une colonne d'un dataset */
export const aggregator = ( {data, dataKey, aggregate}:AggregatorParams ):AggregatorResult => {

    if (data == undefined || dataKey == undefined || data.length < 1){
        return {row: undefined, value: undefined}
    }


    switch (aggregate) {
      case "last": {
        const row = data.slice(-1)[0]
        return { row, value: Number(row[dataKey]) }
      }

      case "first": {
        const row = data[0]
        return { row, value: Number(row[dataKey]) }
      }

      case "lastNotNull":{
        const row = data.filter( r => r[dataKey] != null).slice(-1)?.[0]
        return { row, value: Number(row?.[dataKey]) }
      }

      case "sum":{
        const value = (from(data).rollup({value: op.sum( dataKey) }).object() as SimpleRecord).value 
        return { row: undefined, value}
      }

      case "min":{
        const value = (from(data).rollup({value: op.min( dataKey) }).object() as SimpleRecord).value 
        return { row: undefined, value}
      }

      case "max":{
        const value = (from(data).rollup({value: op.max( dataKey) }).object() as SimpleRecord).value 
        return { row: undefined, value}
       } 

      case "count":{
        const value = (from(data).rollup({value: op.valid(dataKey) }).object() as SimpleRecord).value 
        return { row: undefined, value}
      }

      case "mean":{
        const value = (from(data).rollup({value: op.average(dataKey) }).object() as SimpleRecord).value 
        return { row: undefined, value}
      }

      case "countDistinct":{
        const value = (from(data).rollup({value: op.distinct(dataKey) }).object() as SimpleRecord).value 
        return { row: undefined, value}
      }

      case "countMissing":{
        const value = (from(data).rollup({value: op.invalid(dataKey) }).object() as SimpleRecord).value
        return { row: undefined, value}
      }
    }
}