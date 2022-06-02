import { useEffect, useState } from 'react';
import * as mqtt from 'mqtt/dist/mqtt'

const MQTTserver = "ws://mqtt:9001";

function getClient(errorHandler:Function) {
  const client = mqtt.connect(MQTTserver);
  client.stream.on("error", (err:any) => {
    errorHandler({message:`Connection to ${MQTTserver} failed:`, error:err});
    closeConnection(client);
  });
  return client;
}

function subscribe(client:any, topic:string, errorHandler:Function) {
  console.log("Subscribing to " + topic);
  const callBack = (err:any, granted:boolean) => {
    if (err) {
      errorHandler("Subscription request failed: ", err);
    }
    else{
      console.log("Subscribed to topic: ", topic);
    }
  };
  return client.subscribe(topic, callBack);
}

function onMessage(client:any, callBack:Function) {
  client.on("message", (topic:string, message:Buffer) => {
    callBack(topic, message.toString());
  });
}

function unsubscribe(client:any, topic:string) {
  client.unsubscribe(topic);
}

function closeConnection(client:any) {
  client.end();
}

const mqttService = {
  getClient,
  subscribe,
  onMessage,
  unsubscribe,
  closeConnection,
};

export default function useMQTTMessages(onMessage:Function, subscriptions:Array<string>) {
  const [client, setClient] = useState();
  
  useEffect(() => {
    if(!client){
      const c = mqttService.getClient((err:any) => {console.error(err);});
      subscriptions.forEach((subscription:string) => {
        mqttService.subscribe(c, subscription, (err:any) => {console.error(err);});
      });
      mqttService.onMessage(c, onMessage);
      setClient(c);
    }
  }, [client, onMessage, subscriptions])
    
  // return () => mqttService.closeConnection(client);
  return [onMessage];
}
