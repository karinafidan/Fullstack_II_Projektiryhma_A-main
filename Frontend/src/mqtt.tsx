import { useState, useEffect, useRef } from "react";
import mqtt, { MqttClient } from "mqtt";

async function createMqttConnection(
  url: string,
  topic: string,
  callback: (msg: Msg) => void,
) {
  try {
    const client = await mqtt.connectAsync(url);

    await client.subscribeAsync(topic);

    client.on("message", (topic, data) => {
      const msg = JSON.parse(data.toString());
      console.log(msg, topic);

      msg.ts = new Date();

      callback(msg);
    });

    return client;
  } catch (err) {
    console.warn(err);
    throw new Error("Could not connect to mqtt");
  }
}

export type Msg = {
  id: number;
  name: string;
  value: number | null;
  heater: boolean | null;
  set_value: number | null;
  ts?: Date | null;
};

export function useMqtt(url: string, topic: string) {
  const [data, setData] = useState<Msg[]>([]);
  const client = useRef<MqttClient>();

  useEffect(() => {
    if (!client.current) {
      createMqttConnection(url, topic, (msg: Msg) => {
        setData((currentData) => {
          currentData.push(msg);
          return [...currentData];
        });
      });
    }

    return () => {
      client.current?.end();
    };
  }, [topic, url]);

  return [data];
}

// React-komponentti
// const [data] = useMqtt("wss://test.mosquitto.org:8081", 'test-amk-fs2');

// Sovelluskomponentti
function MqttComponent() {
  const [data] = useMqtt("wss://test.mosquitto.org:8081", "test-amk-fs2");

  return (
    <>
      {data.map((msg, i) => {
        return <p key={i + "msg"}> {msg.value ?? "no value"} </p>;
      })}
    </>
  );
}

export default MqttComponent;