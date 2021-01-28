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
  color: ${props => props.color || '#1881f2'};
  font-size: ${props => props.fontSize || '14px'};

  background: transparent;
  border: none;
  text-transform: uppercase;
  padding: 8px;
  padding-right: 12px;
  padding-left: 12px;
  margin: 0;
  &:hover {
    background: ${props => props.hoverBgColor || '#ecf5fe'};
  }
`;

export default StyledButton;
