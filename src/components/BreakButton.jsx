import styled from 'styled-components';

const StyledButton = styled.button`
  cursor: pointer;
  appearance: none;
  transition: all 250ms;
  user-select: none;
  white-space: nowrap;
  outline: none;
  width: auto;
  border-radius: 6px;
  place-items: center;
  color: ${props => props.theme.button.color};
  font-size: ${props => props.fontSize || '14px'};

  background: transparent;
  border: none;
  text-transform: uppercase;
  padding: 8px;

  margin: 0;
  margin-left: -8px;
  margin-bottom: -8px;
  &:hover {
    background: ${props => props.theme.button.hover.background};
    color: ${props => props.theme.button.hover.color};
  }
`;

export default StyledButton;
