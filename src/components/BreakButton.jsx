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
  color: ${props => props.theme.main[500]};
  font-size: ${props => props.fontSize || '14px'};

  background: transparent;
  border: none;
  text-transform: uppercase;
  padding: 8px;

  margin: 0;
  margin-left: -8px;
  margin-bottom: -8px;
  &:hover {
    background: #eef2ff;
  }
`;

export default StyledButton;
