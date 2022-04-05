import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Brand from './components/brand';
import AnalogueClock from './components/clock';
import Pad from './components/pad';
import Small from './components/small';
import theme from './theme';
import { faBell, faMicrophone, faPhone, faRadio, faTowerCell, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import Weather from './components/weather/weather';
import Alert, { AlertLevels } from './components/alert';
import useMessages from './message-service';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import useTimer from './timer-service';
import IntervalPicker from './components/interval-selector';

const Wrapper = styled.div`
  background-color: ${theme.background};
  min-height:100vh!important; 
  width: 100%;
  display: flex;
  flex-direction: row;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif;
`;

const ClockWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Column = styled.div`
  flex: 1;
  padding: 0 2em;
`

const TimeString = styled.div`
  color: ${theme.foreground};
  padding: 1em 0;
  text-align: center;
  font-size: 1.2em;
`;

const AlertsWrapper = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  height: 100vh;
  width: max(30vw, 25rem);
  z-index: 10;
  display: flex;
  flex-direction: column-reverse;
  pointer-events: none;
`;

interface KeyValuePair {
  [id: string]: boolean|any;
}

const randomColour = (seed: number) => {
  return "#" + ((1<<24)*seed | 0).toString(16);
}

const pads:Array<{
  id: string,
  text: string,
  colour: string,
  icon: IconDefinition
}> = [
  {
    id: "tower",
    text: "Tower",
    colour: randomColour(0.21),
    icon: faTowerCell
  },
  {
    id: "streaming",
    text: "Streaming",
    colour: randomColour(0.5),
    icon: faRadio
  },
  {
    id: "mic",
    text: "Microphone",
    colour: randomColour(0.13),
    icon: faMicrophone
  },
  {
    id: "phone",
    text: "Phone",
    colour: randomColour(0.92),
    icon: faPhone
  },
  {
    id: "door",
    text: "Doorbell",
    colour: randomColour(0.95),
    icon: faBell
  }
]

function App() {
  const [date, setDate] = useState<Date>(new Date());
  const [dashboard, setDashboard] = useState<KeyValuePair>();
  const [weather, setWeather] = useState();
  const [alerts, setAlerts] = useState<Array<{level:AlertLevels, text:string, timestamp:string}>|null>();
  const timer1 = useTimer(() => setAlerts([...(alerts ?? []), {
    level: "success",
    text: "Timer complete!",
    timestamp: date.toUTCString()
  }]), date);
  const [isSelectInterval, setIsSelectInterval] = useState(false);
  
  const setPad = useCallback((id:string, state:boolean) => {
    setDashboard((prevState) => {
      return (prevState !== undefined && prevState !== null) ?
      {
        ...prevState,
        [id]:state
      } :
      {[id]:state}
    });
  },[])
  
  // Save dashboard each time it changes
  useEffect(() => {
    if(dashboard !== undefined && dashboard !== null){
      localStorage.setItem('dashboard', JSON.stringify(dashboard));
    }
  }, [dashboard]);
  
  // Save Alerts each time it changes
  useEffect(() => {
    if(alerts !== undefined && alerts !== null){
      localStorage.setItem('alerts', JSON.stringify(alerts));
    }
  }, [alerts]);
  
  // Save Weather each time it changes
  useEffect(() => {
    if(weather !== undefined && weather !== null){
      localStorage.setItem('weather', JSON.stringify(weather));
    }
  }, [weather]);
  
  // Restore state from localStorage
  useEffect(() => {
    const storedDashboard:string|null = localStorage.getItem("dashboard");
    if(storedDashboard !== undefined && storedDashboard !== null && storedDashboard !== 'undefined'){
      setDashboard(JSON.parse(storedDashboard));
    }
    
    const storedAlerts:string|null = localStorage.getItem("alerts");
    if(storedAlerts !== undefined && storedAlerts !== null && storedAlerts !== '[]'){
      setAlerts(JSON.parse(storedAlerts));
    }
    
    const storedWeather:string|null = localStorage.getItem("weather");
    if(storedWeather !== undefined && storedWeather !== null && storedWeather !== 'undefined'){
      setWeather(JSON.parse(storedWeather));
    }
  }, []);
  
  
  useMessages((data: [{type:string, body:any}]) => {
    data.forEach((message) => {
      console.log(message);
      switch (message.type) {
        case "date":
          setDate(new Date(message.body.date));
          break;
        case "pad":
          setPad(message.body.id, message.body.state);
          break;
        case "alert":
          if(alerts === null || alerts === undefined )setAlerts([message.body])
          else setAlerts([...alerts, message.body])
          break;
        case "weather":
          setWeather(message.body);
          break;
      }
    })
  });
  
  return (
    <Wrapper className="App">
      <AlertsWrapper>
        {alerts?.map((alert:{level:AlertLevels, text:string, timestamp:string}, key:number):React.ReactElement => 
          <Alert
            key={key}
            level={alert.level}
            acknowledge={() => setAlerts(alerts.filter((alert, i) => i !== key))}
            timestamp={new Date(alert.timestamp)}
          >
            {alert.text}
          </Alert>
        ).reverse()}
      </AlertsWrapper>
      <Column>
        {pads.slice(0, 4).map((pad, key) => (
          <Pad
            key={key}
            colour={pad.colour}
            accentColour={pad.colour}
            selected={dashboard?.[pad.id]}
            setSelected={(state:boolean) => setPad(pad.id, state)}
            icon={pad.icon}
          >
            {pad.text}
          </Pad>
        ))}
      </Column>
      <Column>
        <Brand>
          Radio Eastern FM 98.1 <br />
          <Small>Your voice in the outer-east</Small>
        </Brand>
        <ClockWrapper>
          <AnalogueClock setDate={setDate} date={date}/>
        </ClockWrapper>
        <TimeString>
          {
            date.getMinutes() >= 30 ?
            `It's ${60 - date.getMinutes()} minutes to ${((date.getHours() % 12) || 12) + 1}`:
            `It's ${date.getMinutes()} minutes past ${(date.getHours() % 12) || 12}`
          }
          <br />
          <br />
          {date.toLocaleDateString('en-gb', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </TimeString>
      </Column>
      <Column>
        {pads.slice(4).map((pad, key) => (
          <Pad
            key={key}
            colour={pad.colour}
            accentColour={pad.colour}
            selected={dashboard?.[pad.id]}
            setSelected={(state:boolean) => setPad(pad.id, state)}
            icon={pad.icon}
          >
            {pad.text}
          </Pad>
        ))}
        <Weather weather={weather} />
          <Pad
            colour={"#E05f9f"}
            accentColour={"#D05f9f"}
            icon={faClock}
            selected={timer1.isRunning}
            setSelected={() => {}}
            onClick={() => {
              if(timer1.isComplete){
                setIsSelectInterval(!isSelectInterval);
              }
              else{
                timer1.isRunning ? timer1.pause() :timer1.start();
              }
            }}
            ondblclick={() => timer1.reset()}
          >
            {timer1.isComplete ? 
              "Add timer" : timer1.countDown}
          </Pad>
          <IntervalPicker
            setInterval={(s:number, m:number, h:number) => {
              timer1.setByInterval(s, m, h)
              timer1.start();
            }}
            onComplete={() => setIsSelectInterval(false)}
            isVisible={isSelectInterval} />
      </Column>
    </Wrapper>
  );
}

export default App;
