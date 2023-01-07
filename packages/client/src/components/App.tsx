import React from 'react';
import { observer } from 'mobx-react';

import { Switch, Scaffold } from 'react-declarative';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import routes from '../config/routes';
import sidemenu from '../config/sidemenu';

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
      zIndex: 99999,
      background: (theme) => theme.palette.background.paper,
    }}
  >
    <CircularProgress />
  </Box>
);

const Fragment = () => <></>;

export const App = observer(() => {
  return (
    <>
      <Scaffold
        dense
        loaderLine={ioc.layoutService.hasAppbarLoader}
        options={sidemenu}
        Loader={Loader}
        onOptionClick={(name) => ioc.routerService.push(name)}
      >
        <Switch
          Loader={Fragment}
          history={ioc.routerService}
          items={routes}
          onLoadStart={() => ioc.layoutService.setAppbarLoader(true)}
          onLoadEnd={() => ioc.layoutService.setAppbarLoader(false)}
          throwError
        />
      </Scaffold>
      {ioc.layoutService.hasModalLoader && (
        <Loader />
      )}
    </>
  );
});

export default App;
