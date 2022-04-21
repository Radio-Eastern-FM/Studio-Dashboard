import React, { useEffect, useState } from 'react';
import 'react-clock/dist/Clock.css';
import styled from 'styled-components';
import * as NumericInput from "react-numeric-input";
import theme from '../settings/theme';

const Label = styled.span`
  font-size: 1.2em;
  width: 50%;
  padding: 0 1em;
  color: ${theme.foreground};
`;

const NumericInputGroup = styled.div`
  display: flex;
  margin: 0.75em 0;
`;

const Confirm = styled.button`
  font-size: 1.2em;
  background-color: ${theme.primary};
  color: ${theme.foreground};
  border: none;
  border-radius: 4px;
  padding: 0.25em 1em;
  transition: 0.15s;
  line-height: 1.2em;
  margin-left: 0.5em;
  &:hover{
    cursor: pointer;
    filter: brightness(0.9);
  }
`;
const Cancel = styled(Confirm)`
  background-color: ${theme.danger};
`;

const Wrapper = styled.div`
  box-shadow: rgba(0, 0, 0, 0.175) 0px 7px 29px 0px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  background-color: ${theme.backgroundAccent};
  padding: 1em;
  border-radius: 7px;
  z-index:100;
  
  & input {
    border-radius: 4px 2px 2px 4px;
    padding: 0.1ex 1ex;
    border: 1px solid #ccc;
    margin-right: 4;
    display: block;
  }
  
`;

function IntervalPicker(props:{setInterval: Function, onComplete:Function, isVisible: boolean}) {
  const [seconds, setSeconds] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => setIsVisible(props.isVisible), [props.isVisible]);
  
  return isVisible ? (
    <Wrapper>
      <NumericInputGroup>
        <Label>Seconds: </Label>
        <NumericInput
          mobile
          min={0} max={120} value={seconds}
          onChange={(val:number) => setSeconds(val)}
        />
      </NumericInputGroup>
      
      <NumericInputGroup>
        <Label>Minutes: </Label>
        <NumericInput
          mobile
          min={0} max={120} value={minutes}
          onChange={(val:number) => setMinutes(val)}
        />
      </NumericInputGroup>
      
      <NumericInputGroup>
        <Label>Hours: </Label>
        <NumericInput
          mobile
          min={0} max={12} value={hours}
          onChange={(val:number) => setHours(val)}
        />
      </NumericInputGroup>
      
      <div style={{alignSelf: 'flex-end'}}>
        <Cancel onClick={() => {
          setIsVisible(false);
          props.onComplete();
        }}>
          Cancel
        </Cancel>
        <Confirm onClick={() => {
          props.setInterval(seconds, minutes, hours);
          setIsVisible(false);
          props.onComplete();
        }}>
          Confirm
        </Confirm>
      </div>
    </Wrapper>
    ): <></>;
}

export default IntervalPicker;
