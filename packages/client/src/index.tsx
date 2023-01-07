import { createRoot } from 'react-dom/client';

import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from "@emotion/react";
import { TssCacheProvider } from "tss-react";

import createCache from "@emotion/cache";

import { ModalProvider } from "react-declarative";
import { ErrorBoundary } from "react-declarative";

import "./polyfills";

import AlertProvider from './components/AlertProvider';

import App from "./components/App";

import THEME_DARK from "./config/theme";

import ioc from './lib/ioc';

const container = document.getElementById('root')!;

const muiCache = createCache({
  "key": "mui",
  "prepend": true
});

const tssCache = createCache({
  "key": "tss"
});

const handleGlobalError = (error: any) => {
  console.warn('Error caught', { error })
  ioc.routerService.push('/error-page');
};

const wrappedApp = (
  <ErrorBoundary history={ioc.routerService} onError={handleGlobalError}>
    <CacheProvider value={muiCache}>
      <TssCacheProvider value={tssCache}> 
        <ThemeProvider theme={THEME_DARK}>
          <ModalProvider>
            <AlertProvider>
              <App />
            </AlertProvider>
          </ModalProvider>
        </ThemeProvider>
      </TssCacheProvider>
    </CacheProvider>
  </ErrorBoundary>
);

const root = createRoot(container);

root.render(wrappedApp);
