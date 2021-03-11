import { css } from 'styled-components';
import browser from 'webextension-polyfill';

const montserratRegular = browser.extension.getURL('assets/fonts/Montserrat-Regular.woff2');
const montserratMedium = browser.extension.getURL('assets/fonts/Montserrat-Medium.woff2');

const styles = css`
  font-family: Montserrat, sans-serif !important;
  font-size: 16px;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background-color: ${props => props.theme.palette.primary};
  color: ${props => props.theme.color.primary};

  @font-face {
    font-family: Montserrat;
    src: url(${montserratRegular}) url(${montserratMedium});
  }
`;

export default styles;
