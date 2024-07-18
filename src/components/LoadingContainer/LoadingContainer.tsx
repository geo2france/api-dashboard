import React from 'react'
import { useEffect, useRef, useState } from "react";
import { Spin } from 'antd';

interface LoadingContainerProps {
    isFetching: boolean;
    children: React.ReactNode;
    blurRadius?: string;
    delay?: number;
  }

/**
 * Composant qui ajoute un effet de flou pendant le chargement (si temps de chargement > delay) et affiche un spinner au centre du contenu.
 * @param isLoading Indique si le chargement est en cours ou non
 * @param children Les éléments enfants à afficher dans le composant
 * @param blurRadius Rayon du floutage (par défaut : 10px)
 * @param delay Délai en millisecondes avant d'appliquer le flou lors du chargement (par défaut : 500ms)
 */
const LoadingContainer:React.FC<LoadingContainerProps> = ({isFetching, children, blurRadius='10px', delay=500}) =>
{
    const [blur, setBlur] = useState(false);
    const timeoutRef = useRef<number | null>(null); //Le timeout permet que le blur ne s'affiche pas si le chargement est plus court que delay (éviter effet clignotement)

    useEffect(() => {
        if(isFetching){
            timeoutRef.current = window.setTimeout(() => {
                setBlur(true);
            }, delay);
        }
        else{
            timeoutRef.current && clearTimeout(timeoutRef.current );
            setBlur(false);
        }
        return () => { timeoutRef.current && clearTimeout(timeoutRef.current ) }
    },[isFetching])

    return(
        <>
            <div style={ blur ? {filter: `blur(${blurRadius})`} : {}}>
                {children}
            </div>
            { blur ? <Spin size="large" style={{position:'absolute', left:'50%', top:'50%' }}/> : <></>}
        </>
    )
}

export default LoadingContainer;