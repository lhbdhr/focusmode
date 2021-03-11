import React from 'react';
import styled from 'styled-components';
import { space, layout, flexbox, position, color } from 'styled-system';
import propTypes from '@styled-system/prop-types';
import omitProps from 'libs/omitProps';

const propsToOmit = [
  ...Object.keys(propTypes.space),
  ...Object.keys(propTypes.layout),
  ...Object.keys(propTypes.flexbox),
  ...Object.keys(propTypes.position),
  ...Object.keys(propTypes.color),
];

const Box = styled(omitProps('div', propsToOmit))`
   box-sizing: border-box;
   ${layout}
   ${space}
   ${flexbox}
   ${position}
   ${color}
`;

export default Box;
