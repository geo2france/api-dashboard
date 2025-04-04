import {
  DownloadOutlined,
  FileImageOutlined,
  FullscreenOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { Card, theme, Modal, Dropdown, MenuProps, Flex, Button, Popover, Typography } from "antd";
import React, { ReactElement, ReactNode, createContext, useEffect, useState } from "react";
import Attribution, { SourceMakerProps, SourceProps } from "../Attributions/Attributions";
import { useChartExport } from "../../utils/usechartexports";
import LoadingContainer from "../LoadingContainer/LoadingContainer";
import { cardStyles } from "../../utils/cardStyles";
import { License } from "../../types";

const { useToken } = theme;

const { Text } = Typography;

export const chartContext = createContext<any>({
  setchartRef: () => {},
  setData: () => {},
  setNodata: () => {}
});

type DataFileType = "csv" | "xlsx" | "ods";

export interface IDashboardElementProps {
  title: string;
  children: ReactNode;
  isFetching?: boolean;
  header?: boolean;
  attributions?: SourceProps[] | SourceMakerProps;
  toolbox?: boolean;
  fullscreen?: boolean;
  exportPNG?: boolean;
  exportData?: boolean;
  description?: ReactElement | string;
  licenses?:License[]
  section?:string
  virtual?:boolean
}

const DashboardElement: React.FC<IDashboardElementProps> = ({
  children,
  title,
  header = true,
  attributions,
  isFetching = false,
  toolbox = true,
  fullscreen = true,
  exportPNG = true,
  exportData = true,
  description, 
  licenses = ['CC', 'BY'],
  virtual = false,
}) => {
  const { token } = useToken();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [chartRef, setchartRef] = useState(undefined);
  const [data, setData] = useState(undefined);
  const [nodata, setNodata] = useState(false);
  const [requestDlImage, setRequestDlImage] = useState(false);
  const [requestDlData, setrequestDlData] = useState<DataFileType | null>(null);

  const { img64, exportImage } = useChartExport({ chartRef: chartRef });

  const downloadImage = () => {
    exportImage();
    setRequestDlImage(true);
  };

  useEffect(() => {
    if (img64 && requestDlImage) {
      const link = document.createElement("a");
      link.href = img64;
      link.download = `${title}.png`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setRequestDlImage(false);
    }
  }, [img64]);

  const downloadData = (filetype: DataFileType) => {
    setrequestDlData(filetype);
  };

  useEffect(() => {
    if (data && requestDlData) {
      const handleDl = async () => {
        const XLSX = await import("xlsx");
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "data");
        XLSX.writeFile(workbook, `${title}.${requestDlData}`, {
          compression: true,
        });
        setrequestDlData(null);
      };
      handleDl();
    }
  }, [requestDlData]);

  const fullscreenChildren = React.Children.map(children, (child, index) => {
    if (index === 0 && React.isValidElement(child)) {
      return React.cloneElement(child, {
        ...child.props?.style,
        style: { height: "80vh" },
      });
    }
    return child;
  });

  const dd_items: MenuProps["items"] = [
    {
      key: "fullscreen",
      label: (
        <a onClick={() => setModalIsOpen(true)}>
          <FullscreenOutlined /> Plein écran
        </a>
      ),
      disabled: !fullscreen,
    },
    {
      key: "export_img",
      label: (
        <a onClick={downloadImage}>
          <FileImageOutlined /> PNG
        </a>
      ),
      disabled: !chartRef || !exportPNG,
    },
    {
      key: "export_data_csv",
      label: (
        <a onClick={() => downloadData("csv")}>
          <DownloadOutlined /> CSV
        </a>
      ),
      disabled: !data || !exportData,
    },
    {
      key: "export_data_xls",
      label: (
        <a onClick={() => downloadData("xlsx")}>
          <DownloadOutlined /> XLSX
        </a>
      ),
      disabled: !data || !exportData,
    },
    {
      key: "export_data_ods",
      label: (
        <a onClick={() => downloadData("ods")}>
          <DownloadOutlined /> ODS
        </a>
      ),
      disabled: !data || !exportData,
    },
  ];

  const dropdown_toolbox = (
    <Dropdown menu={{ items: dd_items }}>
      <a style={{ color: token.colorTextBase }}>
        <MoreOutlined style={{ marginLeft: 10 }} />
      </a>
    </Dropdown>
  );

  return (
    <>
      <Card
        className="dashboard-element"
        styles={cardStyles}
        style={{
          backgroundColor: virtual ? 'transparent' : undefined,
          boxShadow : virtual ? 'none' : undefined,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        bordered={!virtual}
        title={ header && !virtual &&
          <Flex justify="space-between" align="center">
            <span style={{overflow:"hidden",  paddingRight:15}}>{title}</span>
            <div style={{ marginRight: 5, fontSize: 16 }}>
              {toolbox && dropdown_toolbox}
            </div>
          </Flex>
        }
      >
        <Flex vertical justify="space-between" style={{height:"100%"}}>
          <chartContext.Provider value={{ chartRef, setchartRef, setData, setNodata }}>
            <LoadingContainer isFetching={isFetching} noData={nodata}>
              {children}
            </LoadingContainer>
          </chartContext.Provider>

          <Flex justify="flex-end" align="flex-end" style={{ marginRight: 5}}>
            {attributions && (
              <div style={{ marginTop: "auto" }}>
                <Attribution licenses={licenses} data={attributions} />
              </div>
            )}
            {description && (
              <Popover content={
                    <div style={{ maxWidth: 800 }}>
                      {typeof description === "string" ? 
                        <Text italic type="secondary"> {description} </Text> 
                        : <>{description}</> }
                    </div>
                  } 
              >
                <Button 
                  type="link" 
                  icon={<HiQuestionMarkCircle />} 
                  style={{fontSize:"150%"}}/>
              </Popover>
            )}
          </Flex>
        </Flex>
      </Card>

      {toolbox && fullscreen && (
        <Modal
          forceRender={true}
          title={title}
          open={modalIsOpen}
          onCancel={() => setModalIsOpen(false)}
          onOk={() => setModalIsOpen(false)}
          footer={null}
          wrapClassName="modal-fullscreen"
        >
          {fullscreenChildren}
          {attributions && <Attribution data={attributions} />}
        </Modal>
      )}
    </>
  );
};

export default DashboardElement;
