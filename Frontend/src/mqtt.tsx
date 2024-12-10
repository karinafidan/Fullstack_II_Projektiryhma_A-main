import { useState, useEffect, useRef } from 'react';
import mqtt, { MqttClient } from 'mqtt';

 
async function createMqttConnection(url:string, topic: string, callback: (msg:Msg)=>void) {
  try {
    const client = await mqtt.connectAsync(url);

    await client.subscribeAsync(topic)

    client.on('message', (topic, data) => {
      const msg = JSON.parse(data.toString())
      console.log(msg, topic)

      callback(msg)

    })

    return client
  } catch (err) {
    console.warn(err)
    throw new Error("Could not connect to mqtt")
  }
}

type Msg = {
  id: number,
  name: string,
  value: number,
  heater: boolean,
  set_value: number
}


export function useMqtt(url: string, topic: string) {

  const [data, setData] = useState<Msg[]>([])
  const client = useRef<MqttClient>()

  

  useEffect(() => {

    if (!client.current) {

      createMqttConnection(url, topic, (msg: Msg)=>{
        setData((currentData) => {
          currentData.push(msg)
          return [...currentData]
        })
      })
    }

    return () => {
      client.current?.end()
    }
  }, [])

  return [data]
}

// React-komponentti
  // const [data] = useMqtt("wss://test.mosquitto.org:8081", 'test-amk-fs2'); 


// Sovelluskomponentti
function MqttComponent() {

  const [data] = useMqtt('wss://test.mosquitto.org:8081','test-amk-fs2')


  return (
    <>
      {data.map((msg, i) => {
          return <p key={i + "msg"}> {msg.value ?? 'no value'} </p>
      })}
    </>
  )
}

export default MqttComponent;
