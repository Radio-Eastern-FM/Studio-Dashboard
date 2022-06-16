import React, { useEffect } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import styled from 'styled-components';
import theme from '../settings/theme';

const Wrapper = styled.div`
  position: relative;
  
  .react-clock{
    width:80vh!important;
    height:80vh!important;
  }
  .react-clock__face{
    background-color: ${theme.background}!important;
    border-color: ${theme.foreground}!important;
    border-width: 4px!important;
  }
  .react-clock__hand__body, .react-clock__mark__body{
    background-color: ${theme.foreground}!important;
  }
  .react-clock__hour-hand__body{
    background-color: ${theme.foreground}!important;
    width:11px!important;
    top: 15%!important;
  }
  .react-clock__minute-hand__body{
    background-color: ${theme.foregroundAccent}!important;
    width:8px!important;
    top: 7%!important;
  }
  .react-clock__second-hand__body{
    width:6px!important;
    top: 3%!important;
    bottom: 45%!important;
    background-color: ${theme.danger}!important;
  }
`;

const DigitalClock = styled.div`
  width: 100%;
  text-align: center;
  color: ${theme.foreground};
  text-shadow: 0px 0px 4px ${theme.background};
  z-index: 10;
  position: absolute;
  top: 75%;
  font-family: 'Oxygen Mono', monospace;
  font-size: 3em;
  & .small-time-string{
    font-size: 0.5em;
  }
`;

function AnalogueClock(props:{ date:Date, setDate:Function }) {
  useEffect(() => {
    const interval = setInterval(() => {
      props.date.setSeconds(props.date.getSeconds() + 1);
      props.setDate(new Date(props.date.getTime())); // trigger useState update
    }, 1000);
    
    return () => {
      clearInterval(interval);
    };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  
  return (
    <Wrapper>
      <Clock value={props.date} />
      <DigitalClock>
        {((props.date.getHours() % 12) || 12).toString().padStart(2, '0')}
        :
        {props.date.getMinutes().toString().padStart(2, '0')}
        <span className="small-time-string">
          &nbsp;
          {(props.date.getSeconds()).toString().padStart(2, '0')}
        </span>
      </DigitalClock>
    </Wrapper>
  );
}

export default AnalogueClock;
