import { QuestionCircleOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Flex, Row, Tooltip, Typography } from "antd"
import { Children, ReactElement } from "react";
import { useDataset, datasetInput } from "../Dataset/hooks";
import { Icon } from "@iconify/react";
import { useBlockConfig } from "../DashboardPage/Block";
import { SimpleRecord } from "../../types";
import { aggregator } from "../../utils/aggregator";
import CountUp from "react-countup";
const { Text, Paragraph} = Typography;

type comparwithType = "first" | "previous"

type aggregateType = "last" | "first" | "sum" | "lastNotNull" | "min" | "max" | "count" | "mean" | "countDistinct" | "countMissing"



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

export interface StatisticsProps {
    /** Identifiant du jeu de données ou tableau de valeurs */
    dataset:datasetInput, 

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

    /** Icône. Composant ou nom de l'icône sur https://icon-sets.iconify.design/ */
    icon?: ReactElement | string

    /** Texte à afficher dans le tooltip d'aide */
    help?: string

    /** Comparer la valeur avec la précédente ou la première du jeu de données */
    compareWith? : comparwithType // A supprimer ?

    /** Texte d'annotation (remplace evolution si définie) */
    annotation?: React.ReactNode | ((param: ICallbackParams) => React.ReactNode)

    /** Fonction de formattager a appliquer avant rendu */
    valueFormatter?: ((param: ICallbackParams) => string)

    /** Méthode d'aggrégation */
    aggregate?:aggregateType

    /** Afficher une animation (Count-up) */
    animation?: boolean
}


// DEV : modele cf https://bootstrapbrain.com/component/bootstrap-statistics-card-example/

/**
 * Composant `Statistics` affichant une valeur depuis un dataset.
 */
export const Statistics: React.FC<StatisticsProps> = ({
  dataset:dataset_id,
  dataKey,
  unit,
  evolutionSuffix, // A supprimer
  title,
  icon:icon_input,
  color,
  invertColor = false, // A supprimer
  help,
  compareWith, // A supprimer
  relativeEvolution = false, // A supprimer
  valueFormatter = (param) => (param.value.toLocaleString()),
  annotation,
  aggregate="last",
  animation=false
}:StatisticsProps) => {

    const icon =  typeof icon_input === "string" ? <Icon icon={icon_input} /> : icon_input ;
    const dataset = useDataset(dataset_id);

    const { row , value } = aggregator({data: dataset?.data, dataKey, aggregate})

    const compare_value = compareWith === 'previous' ? dataset?.data?.slice(-2)?.[0]?.[dataKey] : dataset?.data?.slice(0,1)?.[0]?.[dataKey] ; //Première ou avant dernière

    const evolution = relativeEvolution ? 100*((Number(value) - compare_value) / compare_value) : Number(value) - compare_value ;
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
    
            <Text style={{fontSize:"150%", paddingTop:8, paddingBottom:8, paddingLeft:0}}>
              { animation ?   
                <CountUp formattingFn={(v) => `${valueFormatter({...CallbackParams, value:v})} ${unit}` } duration={1.5} end={value || NaN} />
                :
                <span>{valueFormatter(CallbackParams)} {unit}</span>
              }
              </Text>

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


export interface StatisticsCollectionProps {
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
 * `StatisticsCollection` permet de regrouper plusieurs cartes [`Statistics`](?path=/docs/dataviz-statistics--docs)
 * dans un bloc
 * ```
 */
export const StatisticsCollection:React.FC<StatisticsCollectionProps> = ( {children, columns=3, title}:StatisticsCollectionProps ) => {
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