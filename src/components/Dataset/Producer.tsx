import { ReactElement, useContext, useEffect } from "react"
import { SetProducersContext } from "./Dataset"
import { useDataset } from "./hooks"

export type ProducerType = {
    nom: string,
    url?: string
}

interface IProducerProps {
    url?:string
    children:string
}
export const Producer:React.FC<IProducerProps> = ({children, url}) => {
    const setProducerContext = useContext(SetProducersContext)
    useEffect(() => {
      setProducerContext && setProducerContext({ nom: children, url: url });
    }, [children, url]);
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
                const dataset = useDataset(component.props.dataset);
                return dataset ? (
                  <>
                    {" "}
                    Source des données :{" "}
                    {dataset.producers?.map((p, idx) => (
                      <div key={idx}>
                        <a href={p.url}>
                          {p.nom}
                        </a>{" "}
                      </div>
                    ))}
                  </>
                ) : null;
        }
        
        return <></>
}