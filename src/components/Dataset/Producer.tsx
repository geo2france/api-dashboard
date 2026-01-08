import { ReactElement } from "react"
import { useDatasets } from "./hooks"
import { Typography } from "antd"

const {Link} = Typography
export type ProducerType = {
    nom: string,
    url?: string
}

interface IProducerProps {
    url?:string
    children:string
}
/**
 * Les props sont récupérées par le parent (Dataset) et enregistrés avec le dataset 
 */
export const Producer:React.FC<IProducerProps> = () => {
    return <></>
}


interface IProducersFooterProps {
    component:ReactElement
}
/*
Composant pour afficher les producteurs sous le graphique
*/
export const ProducersFooter:React.FC<IProducersFooterProps> = ({component}) => {
        // On vérfie si le composant à une props dataset (définie ou non)
        // Afin de ne PAS afficher de producteur sur les élements qui ne font appel à aucun dataset (par exemple les bloc statiques)
        if('props' in component && 'dataset' in component.props) 
        {
                const dataset_id_arr = Array.isArray(component.props.dataset) ? component.props.dataset : [component.props.dataset]
                const datasets = useDatasets(dataset_id_arr);
                const producers = datasets?.flatMap( (dataset) =>
                  dataset?.producers?.map((p) => ({nom:p.nom, url:p.url}) )
                ).filter(p => p !== undefined)

                const uniqueProducers = Array.from(
                  new Map(
                    producers?.map(p => [p.nom, p]) // clé unique = nom
                  ).values()
                );
                uniqueProducers.sort((a, b) => a.nom.localeCompare(b.nom));

                return ( producers?.length > 0 ) ? (
                  <>
                    Source des données :{" "}
                      {uniqueProducers?.map((p, idx, arr) => (
                        <span key={idx}>
                          <Link href={p.url}>
                            {p.nom}
                          </Link>{idx < arr.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                  </>
                ) : null;
        }
        return <></>
}