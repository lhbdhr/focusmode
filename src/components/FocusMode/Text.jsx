import React, { useState } from 'react';
import styled from 'styled-components';

const Text = styled.span`
  flex-grow: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Enhanced = ({ value }) => {
  return <Text>{value}</Text>;
};

export default Enhanced;
