import { useNavigate } from 'react-router-dom'
import { sensorData } from '../types/sensorData'
import './frontpage.css'


export default function Frontpage() {

    const navigate = useNavigate()

    // Väliaikaista testidataa suurinpiirtein oikeassa muodossa (toivottavasti)
    let Sensors: Array<sensorData> = [
        { id: 1, name: "Olohuone", value: 21, heater: true, set_value: 25 },
        { id: 2, name: "Kellari", value: 14, heater: false, set_value: 0 },
        { id: 3, name: "Ulkoilma", value: -3, heater: false, set_value: 0 },
        { id: 4, name: "Makuuhuone (alakerta)", value: 23, heater: true, set_value: 23 },
        { id: 5, name: "Makuuhuone (yläkerta)", value: 19, heater: false, set_value: 23 }
    ]

    const SensorsDataDisplay = Sensors.map((item) =>
        <li key={item.id} className="sensorList" onClick={() => navigate('/asetukset/' + item.id)}>
            <div className="sensori">
                <h3>Sensori {item.id}</h3>
                <p>{item.name}</p>
                <p>Lämpötila: {item.value}</p>
                <p>Lämmitys päällä: {item.heater ? "Kyllä" : "Ei"}</p>
            </div>
        </li>
        
    )

    return (
        <div id="frontpage">
            <h2>Reaaliaikaiset lämpötilatiedot</h2>
            <div className="container">
                {SensorsDataDisplay}
            </div>
        </div>

    )
}