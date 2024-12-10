import { useNavigate } from "react-router-dom";
import "./frontpage.css";
import { useMqtt } from "./mqtt";
import type { Msg } from "./mqtt";
import { useEffect, useState } from "react";

const defaultSensors: Msg[] = [
  { id: 1, name: "Olohuone", value: null, heater: null, set_value: null },
  { id: 2, name: "Kellari", value: null, heater: null, set_value: null },
  { id: 3, name: "Ulkoilma", value: null, heater: null, set_value: null },
  {
    id: 4,
    name: "Makuuhuone (alakerta)",
    value: null,
    heater: null,
    set_value: null,
  },
  {
    id: 5,
    name: "Makuuhuone (yläkerta)",
    value: null,
    heater: null,
    set_value: null,
  },
];

function useSensors() {
  const [data] = useMqtt("wss://test.mosquitto.org:8081", "test-amk-fs2");
  const [sensors, setSensors] = useState<Msg[]>(defaultSensors);

  useEffect(() => {
    setSensors((current) => {
      const newData = new Map<number, Msg>();
      if (current.length) {
        for (const sensor of current) {
          newData.set(sensor.id, sensor);
        }
      }

      for (const sensorMqtt of data) {
        newData.set(sensorMqtt.id, sensorMqtt);
      }

      return Array.from(newData.values());
    });
  }, [data, setSensors]);

  return sensors;
}

export default function Frontpage() {
  const sensors = useSensors();

  const navigate = useNavigate();

  const SensorsDataDisplay = sensors.map((item) => (
    <li
      key={item.id}
      className="sensorList"
      onClick={() => navigate("/asetukset/" + item.id)}
    >
      <div className="sensori">
        <h3>Sensori {item.id}</h3>
        <p>{item.name}</p>
        <p>Lämpötila: {item.value ?? "ladataan..."}</p>
        <p>
          Lämmitys päällä:{" "}
          {item.heater === null ? "ladataan..." : item.heater ? "Kyllä" : "Ei"}
        </p>
        {item?.ts != null && (
          <p>
            <small>päivitetty: {item?.ts?.toLocaleString("fi")} </small>
          </p>
        )}
      </div>
    </li>
  ));

  return (
    <div id="frontpage">
      <h2>Reaaliaikaiset lämpötilatiedot</h2>
      <div className="container">{SensorsDataDisplay}</div>
    </div>
  );
}