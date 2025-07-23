import { Button, Col, Dropdown, Flex, Grid, Layout, Radio, Row, RowProps } from "antd";
import DashboardElement, {IDashboardElementProps} from "../DashboardElement/DashboardElement";
import React, { isValidElement, ReactElement, useState, createContext, } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParamsState } from "../../utils/useSearchParamsState";
import Control, { DSL_Control } from "../Control/Control";
import { SimpleRecord } from "../../types";
import { Dataset, Debug, Provider } from "../../dsl";
import { DSL_ChartBlock } from "./Block";
import { DEFAULT_PALETTE, Palette, PaletteContext, PaletteType } from "../Palette/Palette";

const { Header } = Layout;


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



type dataset = {
    id: string;
    resource: string;
    data?: SimpleRecord[];
    isFetching: boolean;
    isError: boolean;
    producers?:any[]
}


type ControlContextType = {
    values : Record<string, any>;
    pushValue: (control: { name: string; value: any }) => void;
}

export const DatasetContext = createContext<Record<string, dataset>>({});
export const DatasetRegistryContext = createContext<(dataset: dataset) => void>(()=>{}); // A modifier, utiliser un seul context
export const ControlContext = createContext<ControlContextType | undefined>(undefined);

interface IDSLDashboardPageProps {
    children : React.ReactNode // TODO, lister les type possible ?React.ReactElement<typeof DashboardElement>[];
    name? : string
}
export const DSL_DashboardPage:React.FC<IDSLDashboardPageProps> = ({name = 'Tableau de bord', children}) => {
    const [datasets, setdatasets] = useState<Record<string, dataset>>({});
    const [palette, setPalette] = useState<PaletteType>(DEFAULT_PALETTE);
 
    //const allDatasetLoaded = Object.values(datasets).every(d => !d.isFetching);
    //const isDatasetError = Object.values(datasets).some(d => d.isError);


    // Ajouter ou mettre à jour un dataset
    const pushDataset = (d: dataset) => {
        setdatasets(prev => ({
          ...prev, 
          [d.id]: d
        }));
    };

    

    const childrenArray = React.Children.toArray(children).filter(isValidElement);

    const logicalComponents:string[] = [Dataset.name, Provider.name, Palette.name, Debug.name]; //Composant logiques, a ne pas mettre dans la grid

    const getComponentKind = (c:ReactElement) : "logical" | "control" | "other" => {
        if  (typeof(c.type) != 'string' &&  logicalComponents.includes(c.type.name)) {
            return "logical"
        }
        else if (typeof(c.type) != 'string' &&  c.type.name == DSL_Control.name){
            return "control"
        }
        else {
            return "other"
        }
    }

    const visible_components = childrenArray.filter((c) => c && getComponentKind(c)=='other');
    const logic_components = childrenArray.filter((c) => getComponentKind(c) == 'logical');
    const control_components = childrenArray.filter((c) => getComponentKind(c) == 'control');

    return (
    <>
        <Helmet>
            <title>{name}</title>
        </Helmet>
        <DatasetRegistryContext.Provider value={ pushDataset }>
            <DatasetContext.Provider value={ datasets }>
                <PaletteContext.Provider value={{ palette, setPalette }}>
                    { control_components.length > 0 && <Header
                    style={{
                        padding: 12,
                        position: "sticky",
                        top: 0,
                        zIndex: 600, // maplibre top zIndex if 500
                        backgroundColor: "#fff",
                        height: "auto",
                        width: "100%",
                    }}>
                        {control_components}
                    </Header>}

                    <Row gutter={[8,8]} style={{ margin: 16 }}>
                        {  visible_components.map(
                        (component, idx) => 
                                <Col  xl={12} xs={24} key={idx}>
                                    <DSL_ChartBlock>{component}</DSL_ChartBlock>
                                </Col>
                        )
                        }
                    </Row>
                {logic_components}
                </PaletteContext.Provider>
            </ DatasetContext.Provider>
        </DatasetRegistryContext.Provider>
    </>
)}


