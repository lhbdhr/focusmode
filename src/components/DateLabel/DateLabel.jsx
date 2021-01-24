import React from 'react';
import styled from 'styled-components';

const Label = styled.div`
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.font.secondary};
  font-size: 10px;
  letter-spacing: 1.8px;

  & hr {
    height: 1px;
    flex-grow: 1;
    background-color: ${props => props.theme.palette.tertiary};
    border: none;
  }

  & span {
    padding: 0 15px;
  }
`;

const DateLabel = ({ children }) => (
  <Label>
    <hr />
    <span>{children}</span>
    <hr />
  </Label>
);

export default DateLabel;
