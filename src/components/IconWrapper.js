import styled from 'styled-components';

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  margin-right: 4px;
  border-radius: 50%;
  background-color: ${props => props.theme.icon.background};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default IconWrapper;
