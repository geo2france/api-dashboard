import { Control, Dashboard, Debug, useControl } from "@geo2france/api-dashboard/dsl"
import { Form, Slider, Switch } from "antd"
import Pacman from "../charts/Pacman"

export const PacmanPage = () => {
    return (
        <Dashboard columns={1}>
            <Debug />
      <Control>
        <Form.Item name="pacman" initialValue={25}>
          <Slider min={10} max={30} style={{width:150}}></Slider>
        </Form.Item>
        <Form.Item name="pacman_auto" initialValue={true}>
          <Switch />
        </Form.Item>
      </Control>

          <Pacman mouth={Number(useControl('pacman')) || 25} auto={Boolean(useControl('pacman_auto'))}/>
      

        </Dashboard>
    )
}