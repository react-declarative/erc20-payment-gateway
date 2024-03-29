import React from 'react';
import { observer } from 'mobx-react';

import { prefetch, Switch, unload } from 'react-declarative';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';

import routes from '../config/routes';

import ioc from '../lib/ioc';

const Loader = () => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "15px",
      zIndex: 99999,
      background: (theme) => theme.palette.background.paper,
    }}
  >
    <CircularProgress />
    <Typography
      variant="body1"
      sx={{
        maxWidth: "175px",
        textAlign: "center",
      }}  
    >
      Please approve MetaMask confirmation
    </Typography>
  </Box>
);

const Fragment = () => <></>;

export const App = observer(() => {
  return (
    <>
      <CssBaseline />
      {ioc.layoutService.hasAppbarLoader && (
        <Box
          sx={{
            marginBottom: '-4px',
          }}
        >
          <LinearProgress color="secondary" />
        </Box>
      )}
      <Box p={1}>
        <Switch
          Loader={Fragment}
          history={ioc.routerService}
          items={routes}
          onLoadStart={() => ioc.layoutService.setAppbarLoader(true)}
          onLoadEnd={() => ioc.layoutService.setAppbarLoader(false)}
          onInit={async () => await prefetch(true)}
          onDispose={async () => await unload(true)}
          throwError
        />
      </Box>
      {ioc.layoutService.hasModalLoader && (
        <Loader />
      )}
    </>
  );
});

export default App;
