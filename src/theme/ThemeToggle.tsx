import { Button, Tooltip } from 'antd';
import { LaptopOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import type { ThemeMode } from './context';
import { useThemeContext } from './context';

const CYCLE: ThemeMode[] = ['auto', 'light', 'dark'];

const LABELS: Record<ThemeMode, string> = {
  auto: 'Mode auto',
  light: 'Mode clair',
  dark: 'Mode sombre',
};

const ICONS: Record<ThemeMode, React.ReactNode> = {
  auto: <LaptopOutlined />,
  light: <SunOutlined />,
  dark: <MoonOutlined />,
};

interface ThemeToggleProps {
  /** Bouton pleine largeur (utile dans une colonne, ex. footer de la sidebar). */
  block?: boolean;
  /** Affiche le libellé du mode à côté de l'icône (et masque l'infobulle redondante). */
  showLabel?: boolean;
}

/**
 * Bouton qui cycle entre les modes `auto → light → dark → auto`.
 * Doit être rendu à l'intérieur d'un `<ThemeProvider>`.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ block = false, showLabel = false }) => {
  const { mode, setMode } = useThemeContext();

  const handleClick = () => {
    const currentIndex = CYCLE.indexOf(mode);
    const nextMode = CYCLE[(currentIndex + 1) % CYCLE.length];
    setMode(nextMode);
  };

  return (
    <Tooltip title={LABELS[mode]} placement="right" open={showLabel ? false : undefined}>
      <Button
        type="text"
        icon={<span style={{ fontSize: 18, lineHeight: 0, display: "inline-flex" }}>{ICONS[mode]}</span>}
        onClick={handleClick}
        aria-label={LABELS[mode]}
        block={block}
        style={{
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: block ? "flex-start" : "center",
          paddingInline: block ? 16 : 0,
          width: block ? undefined : 40,
          borderRadius: 8,
          textAlign: "left",
        }}
      >
        {showLabel && LABELS[mode]}
      </Button>
    </Tooltip>
  );
};

export default ThemeToggle;
