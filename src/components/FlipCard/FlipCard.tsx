import React, { useRef } from 'react'
import { Button, Card, Typography } from "antd"
import { CSSProperties, ReactElement, useState } from "react"
import { BsInfoCircle, BsInfoCircleFill } from "react-icons/bs"
import { cardStyles } from "../../utils/cardStyles";

const { Text } = Typography;


interface FlipCardProps {
    title?:string|ReactElement
    children:ReactElement | ReactElement[]
    information?:ReactElement|string
}


/**
 * Une card qui peux se retourner et afficher des informations a son verso
 */
const FlipCard: React.FC<FlipCardProps> = ({ title, information, children }) => {
    const [flipped, setFlipped] = useState(false);
    const toggleFlipped = () => setFlipped(!flipped);
    const cardARef = useRef<HTMLDivElement>(null);

    const height = cardARef.current ? cardARef.current.clientHeight : undefined; // Forcer la hauteur à celle de la card "Recto"

    const FlipCardStyle: CSSProperties = {
        transition: "transform 0.8s",
        backfaceVisibility: "hidden",
        width: "100%",
      };

    interface InfoButtonProps {
      filled?:boolean
    }
    const InfoButton: React.FC<InfoButtonProps> = ({filled=false})=> {
      return (
        <Button 
            type="text" 
            shape="circle"
            aria-label="info"
            onClick={toggleFlipped}> 
              {filled ? <BsInfoCircleFill /> : <BsInfoCircle  /> }
        </Button>
      )
    }

    return (
      <div style={{ position: "relative", height: height }}>
        <Card
          title={title}
          extra={<>{information && <InfoButton filled={flipped}/>} </>}
          style={{
            transform: flipped ? "rotateY(180deg)" : "",
            position: "static",
            ...FlipCardStyle,
          }}
          styles={cardStyles} //Default g2f-dashboard style (header & body)
          ref={cardARef}
        >
          {children}
        </Card>
        <Card
          title={title}
          extra={<InfoButton filled={flipped} />}
          style={{
            transform: !flipped ? "rotateY(180deg)" : "",
            height: height,
            top: 0,
            position: "absolute",
            overflow: "auto",
            ...FlipCardStyle,
          }}
          styles={cardStyles} //Default g2f-dashboard style (header & body)
        >
          {typeof information === "string" ? (
            <div style={{ margin: 10 }}>
              <Text italic type="secondary">
                {information}
              </Text>
            </div>
          ) : (
            <>{information}</>
          )}
        </Card>
      </div>
    );
};

export default FlipCard;