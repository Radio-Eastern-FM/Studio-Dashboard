//X///X///X///X///X///X//X//
/*
  THIS FILE IS DEPRECATED.
  PLEASE USE MQTT-SERVICE.ts
*/
//X///X///X///X///X///X//X//
import { useEffect } from 'react';
import { createGlobalState } from 'react-hooks-global-state';

const initialState: { eventSource: EventSource | null; } = {eventSource: null};
const { useGlobalState } = createGlobalState<{ eventSource: EventSource | null; }>(initialState);

export default function useMessages(onMessage:Function) {
  const [eventSource, setEventSource] = useGlobalState('eventSource');
  useEffect(() => {
    if(eventSource) {
      eventSource.close();
    }
    setEventSource(new EventSource("http://localhost:8000/events/"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    // Get EventSource
    if(eventSource !== undefined && eventSource !== null) {
      // Register SSE event onMessage
      eventSource.onmessage = (e: MessageEvent):void => {
        onMessage(JSON.parse(e.data));
      };
      
      eventSource.addEventListener('close', () => {
        console.log("EventSource closed");
        eventSource.close();
      });
    }
    else{
      // EventSource isn't available
      // console.error("EventSource not available!");
    }
  }, [eventSource, onMessage]);
}
