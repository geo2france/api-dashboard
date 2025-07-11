import { DSL_DashboardPage as Dashboard } from "../components/DashboardPage/Page";
import { DSL_Dataset as Dataset } from "../components/Dataset/Dataset";
import { DSL_DataPreview as DataPreview } from "../components/Dataset/DataPreview";
import { DSL_Transform as Transform} from "../components/Dataset/Transform";
import { DSL_Filter as Filter } from "../components/Dataset/Filter";
import { Provider } from "../components/Dataset/Provider";
import { useDataset, useDatasets } from "../components/Dataset/hooks";
import { ChartPie } from "../components/Charts/Pie";
import { ChartYearSerie } from "../components/Charts/YearSerie";
import { Producer } from "../components/Dataset/Producer";
import { DSL_Control as Control, useControl } from "../components/Control/Control";
import { Radio } from "../components/Control/Radio"
import { Select } from "../components/Control/Select"
import { Input } from "antd";
import { Palette, usePalette, PalettePreview } from "../components/Palette/Palette";

export {
    Dashboard,
    Dataset,
    Provider,
    Transform,
    Filter,
    DataPreview,
    ChartPie,
    ChartYearSerie,
    useDataset,
    useDatasets,
    Producer,
    Control,
    useControl,
    Radio,
    Select,
    Input,
    Palette,
    usePalette,
    PalettePreview,
}

