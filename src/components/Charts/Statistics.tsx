import { QuestionCircleOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Flex, Row, Tooltip, Typography } from "antd"
import { Children, ReactElement } from "react";
import { useDataset } from "../Dataset/hooks";
import { Icon } from "@iconify/react";
import { useBlockConfig } from "../DashboardPage/Block";
import { SimpleRecord } from "../../types";
import { from, op } from "arquero"
const { Text, Paragraph} = Typography;

type comparwithType = "first" | "previous"

type aggregateType = "last" | "first" | "sum" | "lastNotNull" | "min" | "max" | "count" | "mean" | "count_distinct" | "count_missing"



interface ICallbackParams {
    /** Valeur principale */
    value: number ;

    /** Jeu de données utilisé */
    data: SimpleRecord[] | undefined;

    /** Ligne courante (pour accéder aux autres champs) */
    row: SimpleRecord | undefined;

    /** Valeur de comparaison */
    compareValue: number ;
}

interface StatisticsProps {
    /** Identifiant du jeu de données */
    dataset:string, 

    /** Nom de la colonne qui contient les valeurs */
    dataKey:string, 

    /** Texte à afficher après l'évolution */
    evolutionSuffix?: string

    /** Afficher l'évolution en % (sinon dans la même unité que la valeur) */
    relativeEvolution?: boolean

     /** Titre */
    title?: string

    /** Couleur */
    color?: string

     /** Unité de la valeur */
    unit?: string

    /** Inverser les couleurs (rouge/vert) de l'évolution */
    invertColor?: boolean

    /** Icône (composant ou nom de l'icône sur Iconify.js ) */
    icon?: ReactElement | string

    /** Texte à afficher dans le tooltip d'aide */
    help?: string

    /** Comparer la valeur avec la précédente ou la première du jeu de données */
    compareWith? : comparwithType // A supprimer ?

    /** Texte d'annotation (remplace evolution si définie) */
    annotation?: React.ReactNode | ((param: ICallbackParams) => React.ReactNode)

    /** Fonction a appliquer avant rendu */
    valueFormatter?: ((param: ICallbackParams) => React.ReactNode)

    /** Méthode d'aggrégation */
    aggregate?:aggregateType
}


// DEV : modele cf https://bootstrapbrain.com/component/bootstrap-statistics-card-example/

/**
 * Composant `Statistics` affichant une valeur d'un dataset avec son évolution.
 *
 * Affiche :
 * - La dernière valeur du dataset
 * - Unité et picto
 * - Évolution par rapport à la première ou l'avant-dernière valeur
 * - Couleur selon évolution positive/négative
 * - Tooltip d'aide si fourni
 *
 * @param {StatisticsProps} props - Propriétés du composant
 * @returns {ReactElement} Carte statistique
 */
export const Statistics: React.FC<StatisticsProps> = ({
  dataset:dataset_id,
  dataKey,
  unit,
  evolutionSuffix,
  title,
  icon:icon_input,
  color,
  invertColor = false,
  help,
  compareWith,
  relativeEvolution = false,
  valueFormatter = (param) => (param.value.toLocaleString()),
  annotation,
  aggregate="last"
}) => {

    const icon =  typeof icon_input === "string" ? <Icon icon={icon_input} /> : icon_input ;
    const dataset = useDataset(dataset_id);

    let row:SimpleRecord | undefined
    let value:number


    switch (aggregate) { // DEVNOTE : a factoriser au niveau de la lib api-dashboard
      case "last":
        row = dataset?.data?.slice(-1)[0]
        value = Number(row?.[dataKey]);
        break;

      case "first":
        row = dataset?.data?.[0]
        value = Number(row?.[dataKey]);
        break;


      case "lastNotNull":
        row = dataset?.data?.filter( r => r?.[dataKey] != null).slice(-1)[0]
        value = Number(row?.[dataKey]);
        break;

      case "sum":
        row = undefined
        value = dataset?.data && (from(dataset?.data).rollup({value: op.sum( dataKey) }).object() as SimpleRecord).value || NaN
        break;

      case "min":
        row = undefined
        value = dataset?.data && (from(dataset?.data).rollup({value: op.min( dataKey) }).object() as SimpleRecord).value || NaN
        break;

      case "max":
        row = undefined
        value = dataset?.data && (from(dataset?.data).rollup({value: op.max( dataKey) }).object() as SimpleRecord).value || NaN
        break;

      case "count":
        row = undefined
        value = dataset?.data && (from(dataset?.data).rollup({value: op.valid(dataKey) }).object() as SimpleRecord).value || NaN
        break;

      case "mean":
        row = undefined
        value = dataset?.data && (from(dataset?.data).rollup({value: op.average(dataKey) }).object() as SimpleRecord).value || NaN
        break;

      case "count_distinct":
        row = undefined
        value = dataset?.data && (from(dataset?.data).rollup({value: op.distinct(dataKey) }).object() as SimpleRecord).value || NaN
        break;

      case "count_missing":
        row = undefined
        value = dataset?.data && (from(dataset?.data).rollup({value: op.invalid(dataKey) }).object() as SimpleRecord).value || NaN
        break;
    }
    console.log(aggregate, value)
    const compare_value = compareWith === 'previous' ? dataset?.data?.slice(-2)?.[0]?.[dataKey] : dataset?.data?.slice(0,1)?.[0]?.[dataKey] ; //Première ou avant dernière

    const evolution = relativeEvolution ? 100*((value - compare_value) / compare_value) : value - compare_value ;
    const evolution_unit = relativeEvolution ? '%' : unit ;
    const evolution_is_good = invertColor ? evolution! < 0 : evolution! > 0;

    const tooltip =  help && <Tooltip title={help}><QuestionCircleOutlined /></Tooltip>

    const CallbackParams:ICallbackParams = {value: value ?? NaN, compareValue: compare_value ?? NaN, data:dataset?.data ?? [], row: row }

    let subtitle

    if (annotation !== undefined){
      subtitle =  typeof annotation === 'function' ? annotation(CallbackParams) : annotation ;
    }
    else if (evolution) {
      subtitle = (
        <Paragraph style={{marginBottom:"0.5rem"}}>
          <Text strong type={ evolution_is_good ? "success" : "danger"} style={{fontSize:"120%"}}>
              { evolution < 0.1 ? '':'+'}
              { evolution.toLocaleString(undefined,  {maximumFractionDigits: 1}) }
              &nbsp;{ evolution_unit }
          </Text>{" "}
          <Text italic type="secondary">
              { evolutionSuffix }
          </Text>
        </Paragraph>)
    }

  return (
    <Card
      title={title}
      style={{
        borderLeft: `4px solid ${color}`,
        height:"100%"
      }}
        styles={{
        body: {
            padding: 16,
            paddingTop: 8,
            paddingBottom: 8
        },
        header: {
            padding: "5px",
            paddingLeft: "15px",
            fontSize: 14,
            minHeight: 35,
        },
        }}
        extra={tooltip}
    >
    <Flex vertical>
      <Flex justify="space-between" align="center">
        <Text style={{fontSize:"150%", paddingTop:8, paddingBottom:8, paddingLeft:0}}>{valueFormatter(CallbackParams)} {unit}</Text>
        {icon && <Avatar
            size={32+8}
            icon={icon}
            style={{ backgroundColor: color }}
        /> }
      </Flex>

      { 
        typeof subtitle == 'string' ?
                    <Text italic type="secondary">{subtitle}</Text>
        :
        <div>{subtitle}</div>
      }

    </Flex>
    </Card>
  );
}


type StatisticsCollectionProps = {
  /**
   * Un ou plusieurs composants `<Statistics>`.
   */
  children: ReactElement<typeof Statistics> | ReactElement<typeof Statistics>[];

  /**
   * Nombre de colonnes (défaut : 3)
   */
  columns?: number

  /**
   * Titre du bloc.  
   */
  title?: string
};

/**
 * `StatisticsCollection` permet de regrouper plusieurs cartes statistiques
 * dans un bloc
 * 
 * @param {StatisticsProps} props - Propriétés du composant
 * @returns {ReactElement} Collection de cartes statistiques
 * ```
 */
export const StatisticsCollection:React.FC<StatisticsCollectionProps> = ( {children, columns=3, title} ) => {
  const arrayChildren = Children.toArray(children);
  useBlockConfig({title:title})
  return (
      <Row gutter={[8,8]} style={{margin:8}}>
      { arrayChildren.map( (c, index) => (
        <Col  xl={24/columns} xs={24} key={index}>{c}</Col>
      ))}
      </Row>
  )
}