import React from 'react';
import styled from 'styled-components';

const width = 320;

const Container = styled.div`
  height: 100vh;
  box-sizing: border-box;
  width: ${width}px;
  background-color: ${props => props.theme.background};
  padding: 18px;
`;

export default Container;
