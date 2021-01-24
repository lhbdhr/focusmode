import { createStyled } from '@stitches/react';

export const { styled, css } = createStyled({
  prefix: '$',
  tokens: {
    colors: {
      $gray500: 'hsl(206,10%,76%)',
      $blue500: 'hsl(206,100%,50%)',
      $purple500: 'hsl(252,78%,60%)',
      $green500: 'hsl(148,60%,60%)',
      $red500: 'hsl(352,100%,62%)',
    },
    space: {
      $1: '5px',
      $2: '10px',
      $3: '15px',
    },
    fontSizes: {
      $1: '12px',
      $2: '13px',
      $3: '15px',
    },
    fonts: {
      $untitled: 'Untitled Sans, apple-system, sans-serif',
      $mono: 'Söhne Mono, menlo, monospace',
    },
  },
  utils: {
    m: config => value => ({
      marginTop: value,
      marginBottom: value,
      marginLeft: value,
      marginRight: value,
    }),
    mt: config => value => ({
      marginTop: value,
    }),
    mr: config => value => ({
      marginRight: value,
    }),
    mb: config => value => ({
      marginBottom: value,
    }),
    ml: config => value => ({
      marginLeft: value,
    }),
    mx: config => value => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: config => value => ({
      marginTop: value,
      marginBottom: value,
    }),
    p: config => value => ({
      paddingTop: value,
      paddingBottom: value,
      paddingLeft: value,
      paddingRight: value,
    }),
    pt: config => value => ({
      paddingTop: value,
    }),
    pr: config => value => ({
      paddingRight: value,
    }),
    pb: config => value => ({
      paddingBottom: value,
    }),
    pl: config => value => ({
      paddingLeft: value,
    }),
    px: config => value => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: config => value => ({
      paddingTop: value,
      paddingBottom: value,
    }),
  },
});
