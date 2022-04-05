import { useCallback, useEffect, useState } from 'react';

export default function useTimer(onFinish:Function, date:Date) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeDue, setTimeDue] = useState(new Date());
  const [isComplete, setIsComplete] = useState(true);
  
  const start = () => {
    // console.log("start");
    setIsComplete(false);
    setTimerRunning(true);
  };
  
  const pause = () => {
    // console.log("pause");
    updateTimer();
    setTimerRunning(false);
  };
  
  const reset = useCallback(() => {
    // console.log("reset");
    setTimerRunning(false);
    setSecondsLeft(0);
    setTimeDue(date);
    setIsComplete(true);
  }, [date]);
  
  const getCountDown = () => {
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
  };
  
  const updateTimer = useCallback(() => {
    const seconds = (timeDue.getTime() - date.getTime())/1000;
    if(seconds <= 0){
      // console.log("Finish");
      reset();
      onFinish();
    }
    else{
      setSecondsLeft(seconds);
    }
  }, [date, onFinish, reset, timeDue]);
  
  const setByDate = (timerEnd:Date) => {
    setTimeDue(timerEnd);
  };
  
  const setByInterval = useCallback((seconds:number, minutes:number, hours:number, ) => {
    const totalSeconds = seconds + 60*minutes + 60*60*hours;
    const timerEnd = new Date(date.getTime());
    
    // Set timer to now + interval
    timerEnd.setTime(date.getTime() + totalSeconds*1000)
    
    setByDate(timerEnd);
  }, [date]);
  
  useEffect(() => {
    if(timerRunning) {
      // If timer running, update timer
      updateTimer();
    }
  }, [timerRunning, updateTimer]);
  
  useEffect(() => {
    if(!timerRunning) {
      // Push back timerEnd while the timer is paused.
      setByInterval(secondsLeft, 0, 0);
    }
  }, [secondsLeft, setByInterval, timerRunning])
  
  return {
    start: start,
    pause: pause,
    reset: reset,
    setByDate: setByDate,
    setByInterval: setByInterval,
    countDown: getCountDown(),
    isRunning: timerRunning,
    isComplete: isComplete,
  }
}
