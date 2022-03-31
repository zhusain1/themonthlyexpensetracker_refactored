import { createTheme } from '@mui/material/styles';

const globalTheme = createTheme({
  palette: {
    primary: {
      main: '#000000'
    },
    secondary: {
      main: '#595959'
    }
  },

  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '325px',
          color: 'black',
          paddingBottom: '24px'
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          margin: '20px'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'black'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#212121',
          color: '#f5f5f5',
          width: '200px',
          borderRadius: '30px',
          '&:hover': {
            backgroundColor: '#595959',
            color: '#f5f5f5',
          },
          '&:disabled': {
            backgroundColor: '#212121',
            color: 'white',
            opacity: 0.5
          },
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          '&:hover': {
            cursor: 'pointer'
          }
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontWeight: 450,
          '&:hover': {
            cursor: 'pointer',
            fontWeight: 600
          }
        }
      }
    }
  }
});

export { globalTheme };
