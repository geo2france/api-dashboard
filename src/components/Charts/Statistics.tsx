import { QuestionCircleOutlined } from "@ant-design/icons";
import { Avatar, Card, Flex, Tooltip, Typography } from "antd"
import { ReactElement } from "react";
import { useDataset } from "../Dataset/hooks";
import { Icon } from "@iconify/react";

const { Text, Paragraph} = Typography;

type comparwithType = "first" | "previous"

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
}


// DEV : modele cf https://bootstrapbrain.com/component/bootstrap-statistics-card-example/
// TODO : un bloc pour regrouper plusieurs cards ?

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
  relativeEvolution = false
}) => {

    const icon =  typeof icon_input === "string" ? <Icon icon={icon_input} /> : icon_input ;
    const dataset = useDataset(dataset_id);

    const value = dataset?.data?.slice(-1)[0][dataKey] ; // Dernière valeur du dataset
    const compare_value = compareWith === 'previous' ? dataset?.data?.slice(-2)[0][dataKey] : dataset?.data?.slice(0,1)[0][dataKey] ; //Première ou avant dernière


    const evolution = relativeEvolution ? Math.round(100*((value - compare_value) / compare_value)) : value - compare_value ;
    const evolution_unit = relativeEvolution ? '%' : unit ;
    const evolution_is_good = invertColor ? evolution! < 0 : evolution! > 0;

    const tooltip =  help && <Tooltip title={help}><QuestionCircleOutlined /></Tooltip>

  return (
    <Card
      title={title}
      style={{
        borderLeft: `4px solid ${color}`,
        borderRadius: 0,
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

      {evolution && <Paragraph style={{marginBottom:"0.5rem"}}>
        <Text strong type={ evolution_is_good ? "success" : "danger"} style={{fontSize:"120%"}}>
            { evolution < 0 ? '':'+'}{evolution}&nbsp;{ evolution_unit }
        </Text>{" "}
        <Text italic type="secondary">
            {evolutionSuffix}
        </Text>
      </Paragraph> }
    </Flex>
    </Card>
  );
}