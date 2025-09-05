import { Button, Card, Col, Row, Typography} from "antd"

const { Title, Paragraph, Text, Link } = Typography;

export const HomePage:React.FC = () => {
    return (
<Row gutter={[16, 16]} style={{ margin: 16 }}>
  {/* Card: Welcome */}
  <Col span={24}>
    <Card>
      <Title level={2}>🌟 Bienvenue sur votre tableau de bord ! 🚀</Title>
      <Paragraph>
        Vous avez installé le <Text italic>template</Text> de votre tableau de bord.
        Il ne reste plus qu'à construire vos visualisations et à personnaliser le style.
      </Paragraph>
      <Paragraph>
        <Link href="https://geo2france.github.io/api-dashboard/"><Button type="primary">Documentation officielle</Button></Link>
      </Paragraph>
    </Card>
  </Col>


</Row>

    );
}