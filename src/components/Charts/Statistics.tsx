import { QuestionCircleOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Flex, Row, Tooltip, Typography } from "antd"
import { Children, ReactElement } from "react";
import { useDataset } from "../Dataset/hooks";
import { Icon } from "@iconify/react";
import { useBlockConfig } from "../DashboardPage/Block";
import { SimpleRecord } from "../../types";

const { Text, Paragraph} = Typography;

type comparwithType = "first" | "previous"

interface annotation_params_type {
    /** Valeur principale */
    value: number ;

    /** Jeu de données utilisé */
    data: SimpleRecord[] | undefined;

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
    compareWith? : comparwithType

    /** Texte d'annotation (remplace evolution si définie) */
    annotation?: React.ReactNode | ((param: annotation_params_type) => React.ReactNode)
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
  annotation
}) => {

    const icon =  typeof icon_input === "string" ? <Icon icon={icon_input} /> : icon_input ;
    const dataset = useDataset(dataset_id);

    const value = dataset?.data?.slice(-1)[0][dataKey] ; // Dernière valeur du dataset. Caster en Number ?
    const compare_value = compareWith === 'previous' ? dataset?.data?.slice(-2)[0][dataKey] : dataset?.data?.slice(0,1)[0][dataKey] ; //Première ou avant dernière

    const evolution = relativeEvolution ? 100*((value - compare_value) / compare_value) : value - compare_value ;
    const evolution_unit = relativeEvolution ? '%' : unit ;
    const evolution_is_good = invertColor ? evolution! < 0 : evolution! > 0;

    const tooltip =  help && <Tooltip title={help}><QuestionCircleOutlined /></Tooltip>

    const annotation_params:annotation_params_type = {value: value || NaN, compareValue: compare_value || NaN, data:dataset?.data || [] }

    let subtitle

    if (annotation !== undefined){
      subtitle =  typeof annotation === 'function' ? annotation(annotation_params) : annotation ;
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
        <Text style={{fontSize:"150%", paddingTop:8, paddingBottom:8, paddingLeft:0}}>{value?.toLocaleString()} {unit}</Text>
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
      <Row gutter={[8,8]}>
      { arrayChildren.map( (c, index) => (
        <Col  xl={24/columns} xs={24} key={index}>{c}</Col>
      ))}
      </Row>
  )
}