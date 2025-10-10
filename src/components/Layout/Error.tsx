import React from "react";
import { Result, Typography, Space, Alert } from "antd";
import { ErrorBoundary as ErrorBoundaryBase} from "react-error-boundary";
import { Icon } from "@iconify/react";

const { Text } = Typography;

export const ErrorComponent: React.FC = () => {
    return (
        <Result
            status="404"
            title="404"
            extra={
                <Space direction="vertical" size="large">
                    <Space>
                        <Text>
                            La page n'existe pas
                        </Text>
                    </Space>
                </Space>
            }
        />
    );
};


interface ErrorBoundaryProps {
    children?: React.ReactNode
}
export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({children}) => {
    const fallback =  (
        <Alert
        message={ <Icon icon="garden:face-very-sad-stroke-12" fontSize={25} /> }
        description={ 
            <div>
                <p> Cette visualisation ne peux malheureusement pas s'afficher.</p>
                <p> Contactez l'administrateur·rice du tableau de bord si le problème persiste.</p>
            </div>}
        type="warning"
        />
    )

    return (
            <ErrorBoundaryBase fallback={ fallback} >
            {children}
            </ErrorBoundaryBase>
    )
}