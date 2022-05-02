import { useCallback, useEffect, useState } from 'react';

export default function usePersistentState<T>(
  label: string,
  initial: T,
  serialise: Function = (x:T) => JSON.stringify(x),
  deserialise: Function = (x:string) => JSON.parse(x)
) : [T, Function]{
  const [obj, setObj] = useState<{value:T}>();
  // const [obj, setObj] = useState<{value:T}>({value:initial});
  
  const storeObject = useCallback((o:T) => {
    window.localStorage.setItem(label, JSON.stringify({value: serialise(o)}));
  }, [label, serialise]);
  
  // Save state to window.localStorage whenever it changes
  useEffect(() => {
    if(obj)
      storeObject(obj.value);
  }, [obj, storeObject]);
  
  // Restore state from window.localStorage
  const restoreSavedData = useCallback(() => {
    const storedObj:string|null = window.localStorage.getItem(label);
    if(storedObj === undefined || storedObj === null || storedObj === 'undefined'){
      setObj({value: initial});
      return;
    }
    const parsedObj = JSON.parse(storedObj);
    try {
      console.log("restoring", label, deserialise(parsedObj.value));
      setObj({value: deserialise(parsedObj.value)});
    } catch (error) {
      console.log("Failed to parse " + label + " with value ", parsedObj);
    }
  }, [label, initial, deserialise]);
  
  // Set object wrapper
  const setObject = useCallback(async (o:T, callBack:Function) => {
    setObj({value: o});
    storeObject(o);
  }, [storeObject]);
  
  // Restore state from localStorage on first run
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => restoreSavedData(), []);
  
  return [obj ? obj.value : initial, setObject];
}
