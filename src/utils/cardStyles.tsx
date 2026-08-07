import { CardProps } from "antd";
import { theme } from "antd";

/**
 * Hook retournant les styles de Card dérivés des tokens Ant Design actifs.
 * Compatible light/dark.
 */
export const useCardStyles = (): CardProps["styles"] => {
  const { token } = theme.useToken();
  return {
    body: {
      padding: 0,
      height: "100%",
    },
    header: {
      padding: `${token.paddingXXS}px`,
      paddingLeft: `${token.paddingSM}px`,
      fontSize: token.fontSizeSM,
      minHeight: token.controlHeight + 3,
    },
  };
};
