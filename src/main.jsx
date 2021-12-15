import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import ThemeProvider from './context/themeContext';
import './global.css';
import '@fontsource/roboto';
import '@fontsource/rubik';

const theme = extendTheme({
  fonts: {
    heading: '"Roboto", sans-serif',
    body: '"Rubik", sans-serif',
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
