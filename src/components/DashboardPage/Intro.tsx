import { Icon } from "@iconify/react";
import { FloatButton, Modal } from "antd"
import { ReactElement, useState } from "react"

interface IntroProps{
    children:ReactElement

    /** Titre de la modal */
    title?:string
}
/**
 * Texte introductif optionnel
 * Modal accessible via un bouton flottant dans le coin supérieur droit
 */
export const Intro:React.FC<IntroProps> = ({children, title}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
    <>
        <FloatButton 
            type="primary" 
            onClick={showModal}
            className="IntroButton"
            style={{top:5, height:25}}
            icon={<Icon icon={"fontisto:info"}/> } 
            shape="square"
            />
        <Modal
            title={title}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null} 
              width={{ xs: '100%', xl:'80%', xxl: '80%' }}>
            {children}
        </Modal>
    </>
    )
}