import React from 'react';
import 'react-clock/dist/Clock.css';
import styled from 'styled-components';
import theme from '../settings/theme';

const alertLevelColours = {
  "success": theme.success,
  "info": theme.info,
  "warning": theme.warning,
  "danger": theme.danger
};

const Banner = styled.div`
  background-color: ${(props:{level:AlertLevels}) => alertLevelColours[props.level]};
  padding: 1em;
  margin: 1em;
  position: relative;
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.175) 0px 7px 29px 0px;
  pointer-events: all;
  color: ${(props:{level:AlertLevels}) => props.level === "warning" ? 
    theme.background : theme.foreground};
  font-weight: bold;
`;

const Timestamp = styled.div`
  font-size: 0.7em;
  font-weight: normal;
  font-style: italic;
`;

const Exit = styled.button`
  position: absolute;
  top: 1em;
  right: 1em;
  border: none;
  background: none;
  color: ${(props:{level:AlertLevels}) => props.level === "warning" ? 
    theme.background : theme.foreground};
  &:hover{
    font-weight: bold;
    cursor: pointer;
  }
`;

export type AlertLevels = "success" | "info" | "warning" | "danger";

function Alert(props: {
  level: AlertLevels,
  acknowledge: Function,
  children?:React.ReactNode,
  timestamp:Date
}) {
  return (
    <Banner level={props.level} >
      <Exit onClick={() => props.acknowledge()} level={props.level}>
        x
      </Exit>
      <Timestamp>
        {`[${props.timestamp.toLocaleDateString()} ${(props.timestamp.getHours() % 12) || 12}:${props.timestamp.getMinutes()}:${props.timestamp.getSeconds()}]`}
      </Timestamp>
      <br />
      {props.children}
    </Banner>
  );
}

export default Alert;
