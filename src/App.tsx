import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import Brand from './components/brand';
import AnalogueClock from './components/clock';
import Pad from './components/pad';
import Small from './components/small';
import theme from './settings/theme';
import Weather from './components/weather/weather';
import Alert, { AlertLevels } from './components/alert';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import useTimer from './services/timer-service';
import IntervalPicker from './components/interval-selector';
import usePersistentState from './services/persistent-state';
import useMQTTMessages from './services/mqtt-service';
import { pads } from './settings/settings';

const Wrapper = styled.div`
  background-color: ${theme.background};
  min-height:100vh!important; 
  width: 100%;
  display: flex;
  flex-direction: row;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif;
  @media (max-width: 1300px) {
    flex-direction: column;
    .clock-column{
      flex-direction: column;
      * {
        margin: auto;
      }
    }
    .brand{
      display: none;
    }
  }
`;

const ClockWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Column = styled.div`
  display:flex;
  flex: 1;
  flex-direction: column;
  padding: 0 1em;
  justify-content: space-evenly;
  @media (max-width: 1300px) {
    flex-direction: row;
  }
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

function App() {
  const [date, setDate] = useState<Date>(new Date());
  const [dashboard, setDashboard] = usePersistentState<{[id: string]: boolean }>('dashboard', {});
  const [weather, setWeather] = usePersistentState<object|null>('weather', null);
  const [temperature, setTemperature] = usePersistentState<number|null>('temperature', null);
  const [alerts, setAlerts] = usePersistentState<Array<{level:AlertLevels, text:string, timestamp:string}>>('alerts', []);
  const [isSelectingInterval, setIsSelectingInterval] = useState(false);
  const timer1 = useTimer(
    () => pushAlert("success", "Timer complete!", date.toUTCString()),
    date,
    "timer1");
  
  const pushAlert = useCallback((level:AlertLevels, text:string, timestamp:string) => {
    setAlerts([...alerts, {level, text, timestamp}]);
  }, [alerts, setAlerts]);
  
  const onMQTTreconnect = useCallback(() => {
    setAlerts([...alerts
      .filter((alert) => alert.text !== "MQTT disconnected."), {
        level: "success",
        text: "MQTT Connected",
        timestamp: date.toUTCString()
      }]);
  }, [alerts, date, setAlerts]);
  
  const setPad = useCallback((id:string, state:boolean) => {
    console.log({[id]:state});
    let d:object|null = dashboard;
    (d as {[id: string]: boolean })[id] = state;
    setDashboard(d);
  },[dashboard, setDashboard]);
  
  useMQTTMessages((topic:string, message:string) => {
    switch (topic) {
      case "efm/sensors/doorbell":
        setPad('door', !(dashboard.door as boolean));
        break;
      case "efm/sensors/weather/temperature":
        const temp = Number(message);
        if(temp) setTemperature(temp);
        break;
      case "efm/sensors/weather/humidity":
        // We don't do anything with humidity at the moment.
        break;
      case "efm/weather":
        const w = JSON.parse(message)
        console.log(w);
        setWeather(w);
        break;
      case "efm/alerts":
        console.log(message);
        const JSONmsg = JSON.parse(message);
        pushAlert(JSONmsg.level, JSONmsg.text, date.toUTCString());
        break;
      case "efm/time":
        console.log("NTP time:", message);
        setDate(new Date((message as unknown as number)*1000))
        break;
    }
  }, [
    "efm/sensors/doorbell",
    "efm/sensors/weather/temperature",
    "efm/sensors/weather/humidity",
    "efm/weather",
    "efm/alerts",
    "efm/time"
  ], () => {
    onMQTTreconnect();
  },
  (e:string) => {
    pushAlert("danger", e, date.toUTCString());
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
        {pads.map((pad, key) => {
          if(pad.side !== 'left') return <></>;
          return (
          <Pad
            key={key}
            colour={pad.colour}
            accentColour={pad.colour}
            selected={(dashboard as {[id: string]: boolean|any})?.[pad.id]}
            setSelected={(state:boolean) => setPad(pad.id, state)}
            icon={pad.icon}
          >
            {pad.text}
          </Pad>
        )
        })}
      </Column>
      <Column className="clock-column">
        <Brand className="brand">
          Radio Eastern FM 98.1 <br />
          <Small>Your voice in the outer-east</Small>
        </Brand>
        <ClockWrapper>
          <AnalogueClock date={date} setDate={setDate}/>
        </ClockWrapper>
        <TimeString>
          {
            date.getMinutes() >= 30 ?
            `It's ${60 - date.getMinutes()} minutes to ${((date.getHours() % 12) || 12) + 1}:00`:
            `It's ${date.getMinutes()} minutes past ${(date.getHours() % 12) || 12}:00`
          }
          &nbsp; &nbsp; &nbsp;
          {date.toLocaleDateString('en-gb', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </TimeString>
      </Column>
      <Column>
        <Pad
          colour={"#E05f9f"}
          accentColour={"#D05f9f"}
          icon={faClock}
          selected={timer1.isRunning}
          setSelected={() => {}}
          onClick={() => {
            if(timer1.isComplete){
              setIsSelectingInterval(!isSelectingInterval);
            }
            else{
              timer1.isRunning ? timer1.pause() : timer1.start();
            }
          }}
          ondblclick={() => timer1.reset()}
        >
          {timer1.isComplete ? 
            "Add timer" : timer1.countDown}
        </Pad>
        <Weather weather={weather} currentTemperature={temperature}/>
        {pads.map((pad, key) => {
          if(pad.side !== 'right') return <></>;
          return (
            <Pad
              key={key}
              colour={pad.colour}
              accentColour={pad.colour}
              selected={(dashboard as {[id: string]: boolean|any})?.[pad.id]}
              setSelected={(state:boolean) => setPad(pad.id, state)}
              icon={pad.icon}
            >
              {pad.text}
            </Pad>
          );
        })}
          <IntervalPicker
            setInterval={(s:number, m:number, h:number) => {
              if(s === 0 && m === 0 && h === 0) return; // don't start 0 timer
              timer1.setByInterval(s, m, h);
            }}
            onComplete={() => setIsSelectingInterval(false)}
            isVisible={isSelectingInterval}
          />
      </Column>
    </Wrapper>
  );
}

export default App;
