import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import useAutoFocus from 'hooks/useAutoFocus';

const BaseInput = styled.input`
  background-color: ${props => props.theme.input.background};

  border: none;
  border-radius: 4px;
  height: 35px;
  padding-left: 10px;
  color: ${props => props.theme.input.color};

  width: 100%;
  font-size: 14px;
  box-sizing: border-box;
  border: 2px solid transparent;
  transition: all 0.01s;

  ::placeholder {
    color: ${props => props.theme.cool_grey[400]};
  }

  :focus {
    border: 2px solid ${props => props.theme.main[500]};
    /* background-color: white; */

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
