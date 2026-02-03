import { Tag } from "antd";
import chroma from "chroma-js";
import { createContext, useContext, useEffect } from "react";


export const DEFAULT_PALETTE:PaletteType = {steps:['#264653','#2a9d8f', '#e9c46a','#f4a261','#e76f51'], mode:'hsl'}

type PaletteModeType = 'rgb' | 'hsl' | 'lab' | 'lrgb' | 'lch'

export interface PaletteType {
    steps?:string[]
    mode?:PaletteModeType

    /**
    * Mapping optionnel de libellés vers des couleurs. 
    * Exemple : `labels={{'oui':'#0f0', 'non':'#f00'}}
    * */
    labels?: Record<string, string>
}

type PaletteContextType = {
    palette: PaletteType;
    setPalette: (p: PaletteType) => void;
  };

export const PaletteContext = createContext<PaletteContextType | undefined>({palette:DEFAULT_PALETTE, setPalette:() => {} });

interface UsePaletteProps {
    nColors?: number
}
export const usePalette = ({nColors}:UsePaletteProps) => {
    const palette_context = useContext(PaletteContext);
    const palette_info = palette_context?.palette
    if (nColors === undefined) { return undefined }
    return palette_info?.steps && chroma.scale(palette_info.steps).mode(palette_info.mode || 'hsl').colors(nColors)
}

/**
 * Normalise les labels de la palette en tableau `{ label, color }`.
 * Retourne un tableau vide si aucun label n’est défini.
 */
export const usePaletteLabels = () => {
    const palette_context = useContext(PaletteContext);
    const palette_info = palette_context?.palette

    return Object.keys(palette_info?.labels || {}).map( key =>
        ({
            label:key,
            color:palette_info?.labels?.[key]
        })
    )
}
/*
* Composant permettant à l'utilisateur de définir une palette pour sa page
*/
export const Palette:React.FC<PaletteType> = ({ steps, mode, labels }) => {

    const palette:PaletteType = {steps, mode, labels}

    const palette_context = useContext(PaletteContext);

    useEffect(() => {
        palette_context?.setPalette(palette)
    }, [steps])

    return null
}

export const PalettePreview:React.FC = ({}) => {
    const colors = usePalette({nColors:10}) || []
    const colors_labels = usePaletteLabels()

    return (
        <>
            {colors.map((color) => (
                <Tag key={color} color={color}>{color}</Tag>
            ))}
            <br/>
            Labels : {colors_labels.map( e => <Tag key={e.label} color={e.color}>{e.label}</Tag>)}
        </>
    )
}