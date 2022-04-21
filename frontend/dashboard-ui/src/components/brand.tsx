import React from 'react';
import 'react-clock/dist/Clock.css';
import styled from 'styled-components';
import theme from '../settings/theme';

const Wrapper = styled.div`
  color: ${theme.foreground};
  text-align: center;
  font-size: 2em;
  padding: 0.5em 0;
`;

function Brand(props: {children?:React.ReactNode}) {
  return (
    <Wrapper>
      {props.children}
    </Wrapper>
  );
}

export default Brand;
