import { Badge, Collapse, CollapseProps, Divider, FloatButton, Modal, theme, Typography } from "antd"
import { DataPreview, PalettePreview } from "../../dsl"
import { useAllDatasets } from "../Dataset/hooks"
import { BugOutlined } from "@ant-design/icons"
import { useState } from "react";
import { DatasetBadgeStatus } from "../Dataset/DataPreview";
import { ControlPreview } from "../Control/Control";

const { useToken } = theme;

const { Text, Title } = Typography;

/*
* Ajoute un float-button permettant d'afficher un panneau de debug listant les jeux de données, les contrôles, etc..
*/
export const Debug:React.FC = () => {
    const { token } = useToken();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const datasets = useAllDatasets()

    const items: CollapseProps['items'] = datasets?.map((dataset) => ({
        key: dataset.id,
        label: <span>
                  <DatasetBadgeStatus isError={dataset?.isError} isFetching={dataset?.isFetching} /> {dataset.id} 
                  {" "} <Text type="secondary"> {dataset?.resource} </Text>
                  {" "}<Badge color={token.colorInfo} overflowCount={9999} count={ dataset?.data?.length }/>
                 
                </span>,
        children: <DataPreview dataset={dataset.id} pageSize={3}/>
    }))
    return (<>
        <FloatButton icon={<BugOutlined />} type="primary" onClick={() => setIsModalOpen(true)} style={{top:5}} className="debugFloatButton"/>
        <Modal
            title="Information concepteur"
            width="90%"
            centered
            styles={{content:{'width':"100%", padding:36}}}
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
        >
            <Title level={5} >Jeux de données </Title>
            <Collapse accordion items={items} />

            <Divider />
            <Title level={5} >Contrôles utilisateur </Title>
            <ControlPreview />

            <Divider />

            <Title level={5} >Palette </Title>
            <PalettePreview />

        </Modal>
    </>)
}