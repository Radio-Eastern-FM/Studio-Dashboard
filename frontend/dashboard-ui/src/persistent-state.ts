import { useEffect, useState } from 'react';

export default function usePersistentState<T>(label: string, initial: T) : [T, Function] {
  const [obj, setObj] = useState<{value:T}>({value: initial});
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    if(obj !== undefined && obj !== null){
      localStorage.setItem(label, JSON.stringify(obj));
    }
  }, [label, obj]);
  
  // Restore state from localStorage
  useEffect(() => {
    const storedObj:string|null = localStorage.getItem(label);
    if(storedObj !== undefined && storedObj !== null && storedObj !== 'undefined'){
      setObj(JSON.parse(storedObj));
    }
  }, [label]);
  
  function setObjWrapped (obj:T){
    setObj({value: obj});
  }
  
  return [obj.value, setObjWrapped];
}
