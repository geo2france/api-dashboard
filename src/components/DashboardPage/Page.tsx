import { Button, Col, Dropdown, Flex, Grid, Layout, Radio, Row, RowProps, Tabs, theme } from "antd";
import type { TabsProps } from 'antd';
import DashboardElement, {IDashboardElementProps} from "../DashboardElement/DashboardElement";
import React, { isValidElement, ReactElement, useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParamsState } from "../../utils/useSearchParamsState";
import Control, { ControlContext, DSL_Control } from "../Control/Control";
import { Dataset, Debug, Provider } from "../../dsl";
import { DEFAULT_PALETTE, Palette, PaletteContext, PaletteType } from "../Palette/Palette";
import { Section, SectionProps } from "./Section";
import { Icon } from "@iconify/react";
import { DatasetRegistryContext } from "../Dataset/context";
import { Intro } from "./Intro";

const { Header } = Layout;

const { useToken } = theme;

type Section =  {
    key: string;
    libel?: string;
    order?: number;
    hide?:boolean;
    disable?:boolean;
}

interface IDashboardPageProps {
    control? : React.ReactElement | React.ReactElement[]
    children : React.ReactElement<typeof DashboardElement>[] | React.ReactElement<typeof DashboardElement>;
    row_gutter? : RowProps['gutter']
    sections?: string[] | Section[]
}


const getSection = (child: React.ReactElement): string | undefined => 
    React.isValidElement<IDashboardElementProps>(child) ? child.props.section : undefined ;
  

const DashboardPage:React.FC<IDashboardPageProps> = ({children:children_input, control, row_gutter=[8,8], sections}) => {
    let sections_std:Section[] = []
    const screens = Grid.useBreakpoint();
    const children = React.Children.toArray(children_input).filter((child) =>
        React.isValidElement(child)
      );
    
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


interface IDSLDashboardPageProps {
    children : React.ReactNode // TODO, lister les type possible ?React.ReactElement<typeof DashboardElement>[];
    name? : string
    columns?: number
    debug?: boolean
}




export const DSL_DashboardPage:React.FC<IDSLDashboardPageProps> = ({name = 'Tableau de bord', columns=2, children, debug=false}) => {

    const { token } = useToken();

    const [palette, setPalette] = useState<PaletteType>(DEFAULT_PALETTE);

    const datasetRegistry = useContext(DatasetRegistryContext);
    const controlesRegistry = useContext(ControlContext)
    useEffect(() => {
        return () => { // Page cleanup
            datasetRegistry.clear()
            controlesRegistry?.clear()
        }
    }, []);

    //const allDatasetLoaded = Object.values(datasets).every(d => !d.isFetching);
    //const isDatasetError = Object.values(datasets).some(d => d.isError);



    

    const childrenArray = React.Children.toArray(children).filter(isValidElement);

    const logicalComponents:string[] = [Dataset.name, Provider.name, Palette.name, Debug.name]; //Composant logiques, a ne pas mettre dans la grid

    const getComponentKind = (c:ReactElement) : "logical" | "control" | "other" | "section" | "intro" => {
        if  (typeof(c.type) != 'string' &&  logicalComponents.includes(c.type.name)) {
            return "logical"
        }
        else if (typeof(c.type) != 'string' &&  c.type.name == Intro.name){
            return "intro"
        }
        else if (typeof(c.type) != 'string' &&  c.type.name == DSL_Control.name){
            return "control"
        }
        else if (typeof(c.type) != 'string' &&  c.type.name == Section.name){
            return "section"
        }
        else {
            return "other"
        }
    }

    const visible_components = childrenArray.filter((c) => c && getComponentKind(c)=='other');
    const logic_components = childrenArray.filter((c) => getComponentKind(c) == 'logical');
    const control_components = childrenArray.filter((c) => getComponentKind(c) == 'control');
    const section_components = childrenArray.filter((c) => getComponentKind(c) == 'section') as React.ReactElement<SectionProps>[];
    const intro_component = childrenArray.find((c) => getComponentKind(c) == 'intro') 

    if (debug && !logic_components.some((c) => typeof c.type !== "string" && c.type.name === Debug.name) ){
        logic_components.push(<Debug key="debug_property"/>);
    }


    const items:TabsProps['items'] = section_components.map((s) => (
        {
            key: s.props.title, 
            label: s.props.title, 
            children: s,
            icon: typeof(s.props.icon) === 'string' ? (<Icon icon={s.props.icon} fontSize={18} style={{marginInlineEnd:-6}}/>) : s.props.icon,
        }
    ))

    if (visible_components.length > 0) {items.push({
        key:"99 - Autres", 
        label: '-',
        children:<Section title='Autres'>{visible_components}</Section>
    })}


    return (
    <>
        <Helmet>
            <title>{name}</title>
        </Helmet>

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
                    { items.length > 1 ?
                        <Tabs defaultActiveKey="1" items={items} centered  
                            tabBarStyle={{margin:6, 
                                padding:4, 
                                background:token.colorBgContainer,
                                borderRadius:token.borderRadiusLG}} 
                            style={{margin:4}} />
                        :
                        <div style={{margin:4}}> {items?.[0].children} </div>//Show content without tabs if only one
                    }
                {logic_components}
                {intro_component}
                </PaletteContext.Provider>
    </>
)}

