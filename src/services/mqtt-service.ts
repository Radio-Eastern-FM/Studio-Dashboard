import { useCallback, useEffect, useState } from 'react';
import * as mqtt from 'mqtt/dist/mqtt'

const MQTTserver = "ws://localhost:9001";
// const MQTTserver = "ws://mqtt:9001";

export default function useMQTTMessages(
  onMessage:Function,
  subscriptions:Array<string>,
  onConnect:() => void,
  onError:(e:string) => void
) {
  const [client, setClient] = useState();
  const [isConnected, setIsConnected] = useState(false);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const unsubscribe = useCallback((client:any, topic:string) => {
    client.unsubscribe(topic);
  }, []);
  
  const closeConnection = useCallback((client:any) => {
    client.end();
  }, []);
  
  const getClient = useCallback((errorHandler:Function) => {
    const client = mqtt.connect(MQTTserver);
    client.stream.on("error", (err:any) => {
      errorHandler({message:`Connection to ${MQTTserver} failed:`, error:err});
      closeConnection(client);
    });
    return client;
  }, [closeConnection]);
  
  const onMessageRecieved = useCallback((client:any, callBack:Function) => {
    client.on("message", (topic:string, message:Buffer) => {
      callBack(topic, message.toString());
    });
  }, []);
  
  const subscribe = useCallback((client:any, topic:string, errorHandler:Function) => {
    console.log("Subscribing to " + topic);
    const callBack = (err:any, granted:boolean) => {
      if (err) {
        errorHandler("Subscription request failed.", err);
      }
      else{
        console.log("Subscribed to topic: ", topic);
      }
    };
    return client.subscribe(topic, {
      qos:2
    }, callBack);
  }, []);
  
  
  useEffect(() => {
    if(!client){
      const c = getClient((err:any) => {
        console.error(err);
      });
      subscriptions.forEach((subscription:string) => {
        subscribe(c, subscription, (err:any) => {
          console.error(err);
        });
      });
      onMessageRecieved(c, onMessage);
      
      c.on("close", () => {
        setIsConnected(false);
      })
      c.on("connect", (connack:any) => {
        setIsConnected(true);
      });
      setClient(c);
    }
  }, [client, getClient, onMessage, onMessageRecieved, subscribe, subscriptions])
  
  useEffect(() => {
    if(isConnected) onConnect();
    else onError("MQTT disconnected.");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);
    
  return [onMessageRecieved];
}
