import type { Meta, StoryObj } from '@storybook/react-vite';
import { DashboardApp, PageProps, PagesGroup } from '../..';
import { DSL_DashboardPage as DashboardPage} from '../DashboardPage/Page';
import { default_theme } from './DashboardApp';

const meta = {
  title: 'Layout/DashboardApp',
  component: DashboardApp,
} satisfies Meta<typeof DashboardApp>;

export default meta;

type Story = StoryObj<typeof meta>;

const DemoPage:React.FC<PageProps> = ({})=> (
   <DashboardPage />
)

export const Default: Story = {
  args:{
        title:"Mon tableau de bord",
        logo:"https://www.geo2france.fr/public/logo-g2f.png",
        subtitle:"Sous-titre",
        children:[<PagesGroup title='Groupe de dashboards' icon="clarity:blocks-group-line">
                    <DemoPage title="Dashboard 1" icon="icon-park-solid:web-page" />
                    <DemoPage title="Dashboard 2" icon="icon-park-solid:web-page" />
                 </PagesGroup>,
                <DemoPage title="Dashboard 3" icon="icon-park-solid:web-page" />
        ],
        theme: default_theme,
        brands:[{name:"Acme", logo:"https://static.wikia.nocookie.net/fictionalcompanies/images/c/c2/ACME_Corporation.png/revision/latest?cb=20230628025220"},
            {name:"WB", url:"https://www.warnerbros.com/", logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Warner_Bros._logo_2023.svg/langfr-960px-Warner_Bros._logo_2023.svg.png"}
        ],
        footerSlider: false,
        disablePoweredBy: false
    },
  argTypes: {
    children: {
        control: { disabled: true },
        table: { readonly: true }
    },
    routes: { // Deprecated
        table: { disable: true },
        control: { disabled: true },
    }
  }

}