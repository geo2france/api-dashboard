import { createContext, ReactNode } from "react"
import { DatafairProvider, FileProvider, WfsProvider } from "../.."
import { DataProvider } from "../../data_providers/types";


export const DataProviderContext = createContext<DataProvider | undefined>(undefined)

export type ProviderType = "wfs" | "datafair" | "file"

interface IProviderProps {
    children?:ReactNode
    type:ProviderType
    url:string
}

export const getProviderFromType = (s:ProviderType) => {
    if (s == "datafair"){
        return DatafairProvider
    }else if (s == "wfs"){
        return WfsProvider
    }else if (s == "file"){
        return FileProvider
    } else {
        throw "Unssuported provider"
    }
}


export const Provider:React.FC<IProviderProps> = ({children, type:provider_type, url}) => {

    const provider_fn = getProviderFromType(provider_type)

    return (
        <DataProviderContext.Provider value={ provider_fn(url) } >
            {children}
        </DataProviderContext.Provider>
    )
}