import  { ChartYearSerie, Dashboard, Dataset, Debug, Filter, Palette, Producer, Transform } from "@geo2france/api-dashboard/dsl"
import { Typography } from "antd"

export const PageBiodiv = () => (
 
    <Dashboard name="Biodiversité">
        <Palette steps={['#d90019','#f07508','#336666','#3366ff',]}/>
        <Debug />
       <div>
        <Typography.Title>
            <Typography.Text>Template</Typography.Text>
        </Typography.Title>
        <Typography.Paragraph>
            <Typography.Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ultrices egestas sollicitudin. 
                Donec sagittis quis neque ut blandit. Ut et diam id ligula gravida auctor. Phasellus nec vulputate ipsum. 
                Pellentesque tincidunt laoreet sapien tristique bibendum. Sed ac lectus neque. Vivamus magna nisl, suscipit id
                 odio eu, molestie ultrices augue. Nunc malesuada, enim et luctus facilisis, elit sem semper massa, sit amet aliquam 
                 urna lacus eleifend turpis. Nulla et lorem accumsan, tincidunt nulla non, pulvinar nulla. Duis nunc dui, 
                 suscipit ac velit non, cursus aliquam lorem. Aliquam at lectus vulputate, malesuada dui vitae, egestas ligula. 
                 Phasellus erat nisl, laoreet vel elit id, consequat venenatis risus. 
            </Typography.Text>
        </Typography.Paragraph>
       </div>
       <Dataset
        id="atlas_cocc"
        type="wfs"
        url="https://www.geo2france.fr/geoserver/picardie_nature/ows"
        resource="picardie_nature:atlas_cocc"
        meta={{properties:['ref_year', 'n_sp']}}
       >
            <Filter operator="gte" field="ref_year">2015-01-01</Filter>
            <Transform>SELECT year([ref_year]) as annee, sum(LEAST([n_sp],1)) as presence FROM ? GROUP BY year([ref_year])</Transform>
            
            <Producer url="https://www.geo2france.fr/datahub/dataset/66865703-8c00-41b9-a7a2-226edd705c7b">Picardie Nature</Producer>
       </Dataset>

        <ChartYearSerie 
            title="Atlas coccinelles : nombre de maille 10x10 de présence"
            dataset="atlas_cocc"
            yearKey="annee"
            valueKey="presence"
        />
    </Dashboard>

)