import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createMuiTheme({
  palette: {
    background: {
      dark: '#212529',
      default: colors.common.white,
      paper: colors.grey[700],
    },
    primary: {
      main: colors.indigo[500],
    },
    secondary: {
      main: colors.indigo[500],
    },
    text: {
      primary: colors.grey[300],
      secondary: colors.grey[500],
    },
    colors: ['#1e1e1e', '#25292d', '#495057', '#adb5bd', 'b287a3'],
    gray: colors.grey[500],
    white: colors.grey[300],
    cyan: colors.cyan[500],
    red: colors.red[500],
  },
  shadows,
  typography,
});

export default theme;
