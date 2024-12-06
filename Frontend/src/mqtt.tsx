import { useState, useEffect, useRef } from 'react';
import mqtt, { MqttClient } from 'mqtt';

// Viestityyppi
type Msg = {
  id: number;
  name: string;
  value: number;
  heater: boolean;
  set_value: number;
};

// Luo ja hallitse MQTT-yhteys
function useMqtt(url: string, topic: string): Msg[] {
  const [data, setData] = useState<Msg[]>([]);
  const client = useRef<MqttClient>();

  useEffect(() => {
    const mqttClient = mqtt.connect(url);

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      mqttClient.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Subscribed to topic: ${topic}`);
        } else {
          console.error('Subscription error:', err);
        }
      });
    });

    mqttClient.on('message', (receivedTopic, message) => {
      if (receivedTopic === topic) {
        const msg: Msg = JSON.parse(message.toString());
        console.log('Message received:', msg);
        setData((currentData) => [...currentData, msg]);
      }
    });

    client.current = mqttClient;

    return () => {
      mqttClient.end();
    };
  }, [url, topic]);

  return data;
}

// Sovelluskomponentti

  function App() {

    const [data] = useMqtt("broker.hivemq.com", 'test-amk-fs2')
  
    return (
      <>
        <h1>MQTT </h1>
  
        {data.map((msg, i) => {
          return <p key={i + "msg"}> {msg.value ?? 'no value'} </p>
        })}
      </>
    )
  }

export default App;

