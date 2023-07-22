import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { ChakraProvider } from '@chakra-ui/react';

const rootElement = document.getElementById('root');
const rootDom = ReactDOM.createRoot(rootElement);

rootDom.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
