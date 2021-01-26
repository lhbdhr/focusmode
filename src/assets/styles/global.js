import { css } from 'styled-components';

const styles = css`
  font-size: 16px;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background-color: ${props => props.theme.palette.primary};
  color: ${props => props.theme.font.primary};
`;

export default styles;
