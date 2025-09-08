import { ChartEcharts } from "@geo2france/api-dashboard/dsl";
import { useState, useEffect } from "react";

/* Ce graphique est écrit en JSX, à titre d'exemple.
   Cependant, l'utilisation de TSX est préférable pour bénéficier de 
   la vérification de types et de l'autocomplétion. */

export default function Pacman({mouth = 25, auto=false}) {

    const [currentMouth, setCurrentMouth] = useState(mouth);
    const [pos, setPos] = useState(50); // position en % horizontal

    useEffect(() => {
        if (!auto) {
        // en mode manuel → on fixe directement la bouche
        setCurrentMouth(mouth);
        return;
        }

        // en mode auto → animation avec setInterval
        let direction = 1;
        const interval = setInterval(() => {
        setCurrentMouth(prev => {
            if (prev >= 30) direction = -1; // bouche max
            if (prev <= 10) direction = 1;   // bouche min
            return prev + direction * 2;
        });

        setPos(prev => {
            let next = prev + 1; // vitesse
            if (next > 115) next = -10; // reset à gauche
            return next;
        });
        }, 60);

        return () => clearInterval(interval);
    }, [auto, mouth]);

    const start_angle = 180 - ((100 - currentMouth) / 100 * 360) / 2;

    const options = {
        color : ["#000", "#ffd600"],
        xAxis: {show:false},
        yAxis: {show:false},
        animation:false,

        series: [{
            type:"pie",
            center: [pos + "%", "50%"], // position horizontale animée
            data:[currentMouth, 100 - currentMouth],
            labelLine: {
                show: false
             },
             startAngle:start_angle
        }]
    }
    return (
        <ChartEcharts option={options} />
    )
}