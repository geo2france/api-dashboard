import { CSSProperties, useEffect, useRef } from "react"
import { createRoot, Root } from "react-dom/client";
import { useControl } from "react-map-gl/maplibre";
import type { Map as MaplibreMap } from "maplibre-gl";
import { ConfigProvider, theme } from "antd";
import { Typography } from "antd";
import { useThemeContext } from "../../theme";

const { Text } = Typography;

export interface LegendItem {
    color?:string;
    label:string;
    style?:CSSProperties
}

interface MapLegendProps {
    items:LegendItem[]
    style?:CSSProperties
}

const MapLegend: React.FC<MapLegendProps> = ({ items, style }) => {
    const { token } = theme.useToken();

    const default_style:CSSProperties = {
        backgroundColor: token.colorBgElevated,
        padding: token.paddingSM,
        borderRadius: token.borderRadius,
        border: `1px solid ${token.colorBorderSecondary}`,
        margin: token.marginXS,
    };

    const divStyle = {...default_style, ...style}
    return (
        <div style={divStyle}>
            {items.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: item.color,
                        borderRadius: '2px',
                        marginRight: '8px'
                    }}></div>
                    <Text>{item.label}</Text>
                </div>
            ))}
    </div>
    )
}

export default MapLegend;

interface LegendControlProps {
  /** Elements de légende */
  items: LegendItem[];
}
/** Un control pour Maplibre qui permet d'afficher une légende */
export const LegendControl: React.FC<LegendControlProps> = ({ items }) => {
  const rootRef = useRef<Root | null>(null);

  const { resolvedMode } = useThemeContext();

  useControl(
    () => {
      const container = document.createElement("div");
      //container.className = "maplibregl-ctrl"; // pour hériter du style par défaut

      const root = createRoot(container);
      rootRef.current = root;

      const control = {
        onAdd: (_map: MaplibreMap) => {
          root.render(
            <ConfigProvider theme={{ algorithm: resolvedMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
              <MapLegend items={items} />
            </ConfigProvider>
          );
          return container;
        },
        onRemove: () => {
          container.parentNode?.removeChild(container);
        },
      };

      return control;
    },
    { position: "top-right" } 
  );

    useEffect(() => {
    if (rootRef.current) {
      rootRef.current.render(
            <ConfigProvider theme={{ algorithm: resolvedMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
              <MapLegend items={items} />
            </ConfigProvider>
      );
    }
  }, [items, resolvedMode]);

  return null;
}
