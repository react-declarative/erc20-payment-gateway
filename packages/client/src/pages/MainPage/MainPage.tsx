import { observer } from "mobx-react-lite";
import { Theme } from "@mui/material";

import { makeStyles } from "../../styles";

import {
  FetchView,
  PortalView,
  RevealView,
} from "react-declarative";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import Loader from './Loader';
import Content from './Content';

import Logo from "../../components/common/Logo";

import ioc from "../../lib/ioc";

const useStyles = makeStyles()((theme: Theme) => ({
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
    padding: 15,
  },
  container: {
    position: "relative",
    overflow: "hidden",
    minWidth: 425,
    maxWidth: 425,
  },
  reveal: {
    width: "unset",
  },
}));

export const MainPage = observer(() => {
  const { classes } = useStyles();

  const fetchState = () =>
    [
      ioc.erc20Service.getDecimals(),
      ioc.erc20Service.balanceOfOwner(),
      ioc.erc20Service.getSymbol(),
    ] as const;

  return (
    <PortalView>
      <Box className={classes.root}>
        <RevealView className={classes.reveal}>
          <Paper className={classes.container}>
            <Stack direction="column">
              <Logo />
              <FetchView
                Loader={Loader}
                state={fetchState}
                onLoadStart={() => ioc.layoutService.setAppbarLoader(true)}
                onLoadEnd={() => ioc.layoutService.setAppbarLoader(false)}
              >
                {(decimals, ownerBalance, symbol) => (
                  <Content
                    decimals={decimals}
                    ownerBalance={ownerBalance}
                    symbol={symbol}
                  />
                )}
              </FetchView>
            </Stack>
          </Paper>
        </RevealView>
      </Box>
    </PortalView>
  );
});

export default MainPage;
