import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  width: auto;
  height: 35px;
  border: none;
  background-color: ${props => props.theme.palette.primary};
  color: #1881f2;
  font-size: 12px;
  transition: all 0.2s ease-in-out;
  font-weight: 500;
  text-transform: uppercase;
  outline: none;
  text-align: right;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

export default Button;
