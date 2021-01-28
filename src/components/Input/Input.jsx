import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import useAutoFocus from 'hooks/useAutoFocus';

const BaseInput = styled.input`
  background-color: ${props => props.theme.palette.tertiary};
  border: none;
  border-radius: 4px;
  height: 35px;
  padding-left: 10px;
  color: ${props => props.theme.font.secondary};
  width: 100%;
  font-size: 14px;
  box-sizing: border-box;
  border: 2px solid transparent;

  ::placeholder {
    color: ${props => props.theme.palette.white};
  }

  :focus {
    border: 2px solid #1881f2;
    background-color: white;

    outline: none;
  }
`;

const Input = (props, ref) => {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => inputRef.current);
  useAutoFocus(inputRef);

  return <BaseInput {...props} ref={inputRef} />;
};

export default forwardRef(Input);
