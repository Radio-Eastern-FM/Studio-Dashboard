import { useCallback, useEffect } from 'react';
import usePersistentState from './persistent-state';

export default function useTimer(onFinish:Function, date:Date, timerID:string) {
  const [secondsLeft, setSecondsLeft] = usePersistentState<number>(timerID + '-secondsLeft', 0);
  const [timerDue, setTimerDue] = usePersistentState<Date>(
    timerID + '-timeDue',
    new Date(),
    (d:Date) => d.getTime(),
    (str:string) => new Date(str)
  );
  const [isTimerRunning, setTimerRunning] = usePersistentState<boolean>(timerID + '-timerRunning', false);
  const [isComplete, setIsComplete] = usePersistentState<boolean>(timerID + '-isComplete', true);
  
  const getCountDown = useCallback(function () : string {
    const countdown = new Date(0);
    countdown.setSeconds(secondsLeft);
    let cutoff:number = 11;
    if(secondsLeft < 10) cutoff += 1;
    if(secondsLeft < 60) cutoff += 2;
    if(secondsLeft < 10*60) cutoff += 1;
    if(secondsLeft < 60*60) cutoff += 2;
    if(secondsLeft < 10*60*60) cutoff += 1;
    
    else if(secondsLeft < 60){
      cutoff = 12;
    }
    return countdown.toISOString().substring(cutoff, 19);
  }, [secondsLeft]);
  
  const reset = useCallback(() => {
    setSecondsLeft(0);
    setTimerRunning(false);
    setIsComplete(true);
    setTimerDue(new Date(0));
  }, [setIsComplete, setSecondsLeft, setTimerDue, setTimerRunning]);
  
  const pause = useCallback(function () {
    setTimerRunning(false);
  }, [setTimerRunning]);
  
  // Set Timer using a Date() object
  const setByDate = useCallback((d:Date) => setTimerDue(d), [setTimerDue]);
  
  // Set Timer using seconds, minutes, hours.
  const setByInterval = useCallback((seconds:number, minutes:number, hours:number, ) => {
    setIsComplete(false);
    const totalSeconds = seconds + 60*minutes + 60*60*hours;
    setSecondsLeft(totalSeconds);
    timerDue.setTime(date.getTime() + totalSeconds*1000);
    setTimerDue(timerDue);
  }, [date, setIsComplete, setSecondsLeft, setTimerDue, timerDue]);
  
  // Update seconds and reset when needed.
  useEffect(() => {
    if(isTimerRunning) {
      const seconds = Math.floor((timerDue.getTime() - date.getTime())/1000);
      if(seconds > 0){
        setSecondsLeft(seconds);
      }
      else {
        if(!isComplete){
          console.log("Reset");
          reset();
          onFinish();
        }
      }
    }
  }, [date, isComplete, onFinish, reset, setSecondsLeft, timerDue, isTimerRunning]);
  
  const start = useCallback(function () {
    setIsComplete(false);
    setTimerRunning(true);
    setByInterval(secondsLeft, 0, 0);
  }, [secondsLeft, setByInterval, setIsComplete, setTimerRunning]);
  
  return {
    start: start,
    pause: pause,
    reset: reset,
    setByDate: setByDate,
    setByInterval: setByInterval,
    countDown: getCountDown(),
    isRunning: isTimerRunning,
    isComplete: isComplete,
  }
}
