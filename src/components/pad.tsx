import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react';
import 'react-clock/dist/Clock.css';
import styled from 'styled-components';
import theme from '../settings/theme';

const Button = styled.button`
  display: block;
  width: 100%;
  min-height: 12.5vh;
  height: 100%;
  margin: 0.75em 0;
  background-color: ${(props:{colour:string, selected:boolean}) =>
    props.selected ? props.colour : theme.backgroundAccent};
  border: none;
  color: ${theme.foreground};
  transition: 0.1s;
  font-size: 1.6rem;
  
  :hover{
    cursor: pointer;
    box-shadow: ${(props:{colour:string, selected:boolean, accentColour:string}) =>
    props.selected ? 'inset 0px 0px 5px 0px' + theme.background : '0px 0px 5px 2px' + props.accentColour};
  }
  :active{
    border: solid 1px ${(props:{accentColour:string}) => props.accentColour};
    background-color: ${(props:{accentColour:string}) => props.accentColour};
  }
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 1.5em;
`;

function Pad(props: {
    onClick?:Function,
    ondblclick?:Function,
    colour?:string, 
    accentColour?:string,
    children?:React.ReactNode,
    selected:boolean,
    setSelected:Function
    icon:IconDefinition,
  }) {
  
  return (
    <Button
      onContextMenu={(e:any) => {
        e.preventDefault();
        props.ondblclick && props.ondblclick()
      }}
      onClick={() => {
        props.setSelected(!props.selected);
        props.onClick && props.onClick()
      }}
      colour={props.colour}
      accentColour={props.accentColour}
      selected={props.selected}
    >
      <Icon icon={props.icon}/>
      &nbsp;
      &nbsp;
      {props.children}
    </Button>
  );
}

export default Pad;
