import { css } from 'styled-components';
import browser from 'webextension-polyfill';

const interRegular = browser.extension.getURL('assets/fonts/Inter-Regular.woff2');
const interMedium = browser.extension.getURL('assets/fonts/Inter-Medium.woff2');

const styles = css`
  font-family: Inter, sans-serif;
  font-size: 16px;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background-color: ${props => props.theme.palette.primary};
  color: ${props => props.theme.font.primary};

  @font-face {
    font-family: Inter;
    src: url(${interRegular}) url(${interMedium});
  }
`;

export default styles;
