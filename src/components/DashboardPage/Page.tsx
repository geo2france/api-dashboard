import { Button, Col, Dropdown, Flex, Grid, Radio, Row, RowProps } from "antd";
import DashboardElement, {IDashboardElementProps} from "../DashboardElement/DashboardElement";
import React, { useState } from "react";
import { useSearchParamsState } from "../../utils/useSearchParamsState";
import Control from "../Control/Control";

type Section =  {
    key: string;
    libel?: string;
    order?: number;
    hide?:boolean;
    disable?:boolean;
}

interface IDashboardPageProps {
    control? : React.ReactElement | React.ReactElement[]
    children : React.ReactElement<typeof DashboardElement>[];
    row_gutter? : RowProps['gutter']
    sections?: string[] | Section[]
}


const getSection = (child: React.ReactElement): string | undefined => 
    React.isValidElement<IDashboardElementProps>(child) ? child.props.section : undefined ;
  

const DashboardPage:React.FC<IDashboardPageProps> = ({children, control, row_gutter=[8,8], sections}) => {
    let sections_std:Section[] = []
    const screens = Grid.useBreakpoint();
    
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

                <Flex wrap justify="flex-start" align="flex-start" gap="small">
                    <div>
                        {sections_std.length > 1 && !screens.md &&
                            <Dropdown.Button menu={
                                {   selectedKeys:[activeTab],
                                    items:sections_std.map((section) => ({
                                        label: section.libel || section.key ,
                                        key:section.key,
                                        onClick:  () => setActiveTab(section.key)
                                }) ) }}
                                trigger={['click']}
                                buttonsRender={([_lb, rb]) => [<Button type='primary'>{activeTab}</Button>,rb]}
                            />
                        }
                    </div>
                    { sections_std.length > 1 && screens.md &&
                    <Radio.Group
                                optionType="button"
                                buttonStyle="solid"
                                options={sections_std.map((section) => ({
                                    label: section.libel || section.key ,
                                    value:section.key} ) ) }
                                value = {activeTab}
                                onChange={(e) => setActiveTab(e.target.value)}
                            />
                     }
                    {control}
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

export default DashboardPage;

import { createContext } from 'react';
import { SimpleRecord } from "../../types";

type dataset = {
    id: string;
    resource: string;
    data?: SimpleRecord[];
    isFetching: boolean;
    isError: boolean;

}


export const DatasetContext = createContext<Record<string, dataset>>({});
export const DatasetRegistryContext = createContext<(dataset: dataset) => void>(()=>{});


interface IDSLDashboardPageProps {
    children : React.ReactNode // TODO, lister les type possible ?React.ReactElement<typeof DashboardElement>[];
}
export const DSL_DashboardPage:React.FC<IDSLDashboardPageProps> = ({children}) => {
    const [datasets, setdatasets] = useState<Record<string, dataset>>({});

    //const allDatasetLoaded = Object.values(datasets).every(d => !d.isFetching);
    //const isDatasetError = Object.values(datasets).some(d => d.isError);


    // Ajouter ou mettre à jour un dataset
    const pushDataset = (d: dataset) => {
        setdatasets(prev => ({
          ...prev, 
          [d.id]: d
        }));
    };

    //const childrenArray = React.Children.toArray(children);

    return (
        <DatasetRegistryContext.Provider value={ pushDataset }>
            <DatasetContext.Provider value={ datasets }>
            {children}
            </ DatasetContext.Provider>
        </DatasetRegistryContext.Provider>
        )
}