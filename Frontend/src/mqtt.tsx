import { useState, useEffect, useRef } from 'react';
import mqtt, { MqttClient } from 'mqtt';
 
type Msg = {
  id: number;
  name: string;
  value: number;
  heater: boolean;
  set_value: number;
};

// Luodaan  MQTT-yhteys

function useMqtt(url: string, publishTopic: string, subscribeTopic: string): Msg[] {
  const [data, setData] = useState<Msg[]>([]);
  const client = useRef<MqttClient>();


  // luotiin useEffect ja yhteys
  useEffect(() => {
    const mqttClient = mqtt.connect(url);

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      mqttClient.subscribe(subscribeTopic, (err) => {
        if (!err) {
          console.log(`Subscribed to topic: ${subscribeTopic}`);
        } else {
          console.error('Subscription error:', err);
        }
      });
    });

    // client viestit SubscribleTopic
    
    mqttClient.on('message', (receivedTopic, message) => {
      console.log(`Message received on topic "${receivedTopic}":`, message.toString());
      if (receivedTopic === subscribeTopic) {
        const msg: Msg = JSON.parse(message.toString());
        console.log('Message received:', msg);
        setData((currentData) => [...currentData, msg]);
      }
    });

    client.current = mqttClient;

    return () => {
      mqttClient.end();
    };
  }, [url, subscribeTopic ]);

  // lähetetään viesti publishMessage

  const publishMessage = (msg: Msg) => {
    if (client.current) {
       client.current.publish(publishTopic, JSON.stringify(msg));
       console.log(`Message sent to topic "${publishTopic}":`, msg);
    } else {
       console.error('MQTT client is not connected');
    }
  };

  return [data, publishMessage] as [Msg[], (msg: Msg) => void];
}

// Sovelluskomponentti
// publish topic: a-team
// subscribe topic: a-team

  function App() {

  const publishTopic = 'a-team'; 
  const subscribeTopic = 'a-teamS'; 
  const [data, publishMessage] = useMqtt('mqtt://broker.hivemq.com:1883', publishTopic, subscribeTopic);

  return (
    <div>
      {data.length > 0 ? (
        data.map((msg, i) => (
          <p key={i}>
            <strong>{msg.name}</strong>: {msg.value}°C
          </p>
        ))
      ) : (
        <p>No data received yet</p>
      )}
    </div>
  );
}

export default App;