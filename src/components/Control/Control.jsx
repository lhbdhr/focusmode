import styled from 'styled-components';

const Control = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  border-radius: 50%;
  padding: 5px;
  margin-left: 20px;
  transition: all 0.2s ease-in-out;
  color: ${props => props.theme.palette.secondary};
  cursor: pointer;
  outline: none;

  :hover {
    background-color: #fef2f2;
    color: #dc2626;
  }
`;

export default Control;
