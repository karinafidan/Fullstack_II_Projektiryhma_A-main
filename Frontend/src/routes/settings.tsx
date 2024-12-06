import { ActionFunctionArgs, Form, redirect, useNavigate, useParams } from 'react-router-dom'
import './settings.css'
import { useState } from 'react'
import { Option } from '../types/option'

export async function settingsAction() {
    const selectedSensor = document.getElementById("sensorId")
    console.log(selectedSensor)
    return "Testi!"
}

export const sendSettingsAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const payload = Object.fromEntries(formData.entries())
    console.log(payload)
    return redirect("/")
}

export default function Settings() {

    const navigate = useNavigate()
    const params = useParams()

    const [selectedSensor, setSelectedSensor] = useState(params.sensorId)
    const [temperature, setTemperature] = useState("0")

    function changeSensor(id: string) {
        setSelectedSensor(id)
        navigate('/asetukset/' + id)
    }

    const Options: Array<Option> = [
        {label: "Sensori 1", value: "1"},
        {label: "Sensori 2", value: "2"},
        {label: "Sensori 3", value: "3"},
        {label: "Sensori 4", value: "4"},
        {label: "Sensori 5", value: "5"}
    ]

    const displayOptions = Options.map((item) => 
        <option key={item.label} label={item.label} value={item.value}></option>
    )
    
    return (
        <div className="settings">
            <div className="column">
                <div className="image">
                </div>
            </div>
            <div className="column">
                <div className="options">
                    <h2>Lämmityksen säätö</h2>
                    <Form method="post" id="settingsForm">
                        <div className="row">
                            <ul className="optionsList">
                                <li>
                                    <label>Valitse anturi</label>
                                </li>
                                <br></br>
                                <li>
                                    <select className="sensorId" value={selectedSensor} onChange={e => changeSensor(e.target.value)}>
                                        {displayOptions}
                                    </select>
                                </li>
                            </ul>
                            <ul className="optionsList">
                                <li>
                                    <label>Lämpötila</label>
                                </li>
                                <br></br>
                                <li>
                                    <input type="text" className="temperatureInput" defaultValue={temperature} onChange={e => setTemperature(e.target.value)}></input>
                                </li>
                            </ul>
                        </div>
                        <button type="submit" className="submitterButton" onClick={() => settingsAction()}>Tallenna</button>






                    </Form>
                </div>
            </div>
        </div>
    )
}

