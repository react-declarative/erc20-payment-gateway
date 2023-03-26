import React from "react";

import { makeStyles } from "../../styles/makeStyles";

import { Async, PortalView, RevealView, LoaderView } from "react-declarative";

import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import Logo from "../../components/common/Logo";

import ioc from "../../lib/ioc";

const useStyles = makeStyles()((theme) => ({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    background: theme.palette.background.default,
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    gap: 20,
    padding: 15,
  },
  container: {
    position: "relative",
    overflow: "hidden",
    minWidth: 375,
    maxWidth: 375,
    padding: 15,
  },
  reveal: {
    width: "unset",
  },
}));

export const ConnectPage = () => {
  const { classes } = useStyles();

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <PortalView>
      <Box className={classes.root}>
        <RevealView className={classes.reveal}>
          <Paper className={classes.container}>
            <Stack direction="column" gap="15px">
              <Logo />
              <Async Loader={LoaderView}>
                {async () => {
                  const chainId = await ioc.ethersService.getChainId();
                  if (chainId !== 56) {
                    return (
                      <>
                        <span style={{ marginTop: -10 }}>
                          It looks like currently you are not on the Binance Smart
                          Chain<span className="emoji">😐</span>
                          <br />
                          Would you like to switch the network?
                        </span>
                        <Button
                          variant="contained"
                          onClick={ioc.connectService.handleSwitchBsc}
                        >
                          Switch to BSC
                        </Button>
                      </>
                    );
                  }
                  return (
                    <>
                      <span style={{ marginTop: -10 }}>
                        Could not find the contract, are you connected to the
                        right chain?<span className="emoji">😐</span>
                        <br />
                        Please reload this page and try again
                      </span>
                      <Button
                        variant="contained"
                        onClick={handleReload}
                      >
                        Reload page
                      </Button>
                    </>
                  );
                }}
              </Async>
            </Stack>
          </Paper>
        </RevealView>
      </Box>
    </PortalView>
  );
};

export default ConnectPage;
