import React from 'react';
import 'react-clock/dist/Clock.css';
import styled from 'styled-components';

const Wrapper = styled.span`
  font-size: 0.7em;
`;

function Small(props: {children?:React.ReactNode}) {
  return (
    <Wrapper>
      {props.children}
    </Wrapper>
  );
}

export default Small;

// TODO: convert this back to a styled.component.
