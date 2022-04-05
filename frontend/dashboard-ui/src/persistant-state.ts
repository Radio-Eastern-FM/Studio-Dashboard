import { useEffect } from 'react';

export default function useMessages(onMessage:Function) {
  
  // useEffect(() => {
  //   if(weather !== undefined && weather !== null){
  //     localStorage.setItem('weather', JSON.stringify(weather));
  //   }
  // }, [weather]);
  
  // // Restore state from localStorage
  // useEffect(() => {
  //   const storedDashboard:string|null = localStorage.getItem("dashboard");
  //   if(storedDashboard !== undefined && storedDashboard !== null && storedDashboard !== 'undefined'){
  //     setDashboard(JSON.parse(storedDashboard));
  //   }
    
  //   const storedAlerts:string|null = localStorage.getItem("alerts");
  //   if(storedAlerts !== undefined && storedAlerts !== null && storedAlerts !== '[]'){
  //     setAlerts(JSON.parse(storedAlerts));
  //   }
    
  //   const storedWeather:string|null = localStorage.getItem("weather");
  //   if(storedWeather !== undefined && storedWeather !== null && storedWeather !== 'undefined'){
  //     setWeather(JSON.parse(storedWeather));
  //   }
  // }, []);
}
