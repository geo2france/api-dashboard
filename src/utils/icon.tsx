import { Icon } from "@iconify/react"
import { ReactNode } from "react"

const renderIcon = (input: ReactNode | String) => {

    return typeof(input) === 'string' ? <Icon icon={input} /> : input
}

export default renderIcon