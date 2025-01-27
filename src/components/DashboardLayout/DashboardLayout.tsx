import { Col, Flex, Radio, Row, RowProps } from "antd";
import DashboardElement, {IDashboardElementProps} from "../DashboardElement/DashboardElement";
import React from "react";
import { useSearchParamsState } from "../../utils/useSearchParamsState";
import Control from "../Control/Control";

type Section =  {
    key: string;
    libel?: string;
    order?: number;
    hide?:boolean;
    disable?:boolean;
}

interface IDashboardLayoutProps {
    control? : React.ReactElement
    children : React.ReactElement<typeof DashboardElement>[];
    row_gutter? : RowProps['gutter']
    sections?: string[] | Section[]
}


const getSection = (child: React.ReactElement): string | undefined => 
    React.isValidElement<IDashboardElementProps>(child) ? child.props.section : undefined ;
  

const DashboardLayout:React.FC<IDashboardLayoutProps> = ({children, control, row_gutter=[8,8], sections}) => {
    let sections_std:Section[] = []
    
    if (sections && typeof(sections[0]) === 'string'){
        sections_std = (sections as string[]).map((s) => ({key:s}) ) 
    }else if (sections && typeof(sections[0]) === 'object') {
        sections_std = sections as Section[]
    }
    else{ //Automatic section based on children properties
        sections_std = [...new Set( children.map((child) => getSection(child) ?? 'Autres') )].map((s) => ({key:s}));
    }

    const [activeTab, setActiveTab] = useSearchParamsState('tab',sections_std[0].key)

    sections_std.sort((a,b) => 
       ( a?.order || Infinity ) - (b?.order || Infinity )
    )
    

    return(
        <>
            <Control>
                <Flex>
                    {control}
                    {sections_std.length > 1 &&
                        <Radio.Group defaultValue="a" onChange={(e) => setActiveTab(e.target.value)}
                            value={activeTab} buttonStyle="solid"
                            >
                            {sections_std.map((section, idx) => 
                                <Radio.Button key={idx} value={section.key}>{section.libel || section.key}</Radio.Button>
                            )}
                        </Radio.Group>
                    }
                </Flex>
            </Control>
            <Row gutter={row_gutter} style={{ margin: 16 }}>
                {children.map((child, idx) => ({ child, idx })).filter(({child}) => (getSection(child) ?? 'Autres' ) == activeTab).map(({ child, idx }) => 
                    <Col xl={12} xs={24} key={idx} >
                        {child}
                    </Col>
                )}
            </Row>
        </>
    )
}

export default DashboardLayout;