import styled from 'styled-components';

const Control = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  border-radius: 50%;
  padding: 5px;
  margin-left: 8px;
  margin-right: 8px;
  transition: all 0.2s ease-in-out;
  color: ${props => props.theme.palette.secondary};
  cursor: pointer;
  outline: none;

  :hover {
    background-color: ${props => props.theme.deleteButton.background};
    color: ${props => props.theme.deleteButton.color};
  }
`;

export default Control;
