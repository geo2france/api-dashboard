import { Tooltip, Typography } from 'antd';
import React, { CSSProperties } from 'react';
import { License } from '../../types';
import { Icon } from '@iconify/react';

const { Text, Link } = Typography;

export interface SourceProps {
    name:string,
    url?:string,
}

export interface SourceMakerProps {
    maker?:SourceProps,
    sources?:SourceProps[],
}


interface ILogoLicenceProps {
    license?:License
    style?: CSSProperties
}
const LogoLicence:React.FC<ILogoLicenceProps> = ({license, style}) => {
    switch(license){
        case "CC":
            return <Icon icon="cib:creative-commons" style={style} />
        case "BY":
            return <Icon icon="cib:creative-commons-by" style={style} />
        case "NC":
            return <Icon icon="cib:creative-commons-nc" style={style} />
        case "PD":
            return <Icon icon="cib:creative-commons-pd" style={style} />
        case "SA":
            return <Icon icon="cib:creative-commons-sa" style={style} />
        case "ZERO":
            return <Icon icon="cib:creative-commons-zero" style={style} />
    }
}


interface AttributionProps {
    data:SourceMakerProps | SourceProps[]
    style?:CSSProperties
    licenses?:License[]
}

const Attribution: React.FC<AttributionProps> = ({ data, style, licenses }) => {
    const licence_logo_style:React.CSSProperties = {height:'12px', width:'12px'}

    const sources = Array.isArray(data) ? data : data.sources ;
    const maker = Array.isArray(data) ? undefined : data.maker ;

    const plural = (sources?.length ?? 0) > 1 ? 's' : ''


    return (
        <div style={{paddingLeft:4, paddingBottom:4, ...style}}>
            <Text type="secondary">{`Source${plural} des données : `}
                {sources?.map((e: SourceProps, i:number) => (
                    <span key={i}>
                        <Link href={e.url}>{e.name}</Link>
                        {i < sources.length - 1 ? ", " : ""}
                    </span>
                ))}
                { maker && <span> 
                    {' '}| Réalisation : <Link href={maker.url} >{maker.name}</Link></span> }
                <span style={{marginLeft:5}}>
                <Tooltip title={licenses?.join(' ')} placement="bottom" >
                    { licenses?.map((license, index) => {
                        return (<span key={index} style={{marginLeft:2}}><LogoLicence license={license} style={licence_logo_style} aria-label={license} /></span>)
                    })}
                </Tooltip>
                </span>
            </Text>

        </div>
    )
};

export default Attribution;