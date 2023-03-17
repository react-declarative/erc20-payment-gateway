import { useState } from "react";
import { observer } from "mobx-react-lite";
import { alpha, Theme } from "@mui/material";

import { makeStyles } from "../styles";

import {
  FetchView,
  PortalView,
  RevealView,
  ActionButton,
  getErrorMessage,
  formatAmount,
} from "react-declarative";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import InputBase from '@mui/material/InputBase';
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import Logo from "../components/common/Logo";

import { CC_LESSON_PRICE, CC_DEFAULT_QUANTITY, CC_PAYMENT_GATEWAY_ADDRESS } from "../config/params";

import ioc from "../lib/ioc";

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
  content: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 315,
    paddingBottom: '12px',
  },
  table: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    "& > *": {
      padding: 15,
      borderBottom: `1px solid ${alpha(
        theme.palette.getContrastText(theme.palette.background.default),
        0.23
      )}`,
    },
  },
  reveal: {
    width: "unset",
  },
  noBorder: {
    border: "none !important",
  },
  bold: {
    fontWeight: "bold !important",
  },
  stretch: {
    flex: 1,
  },
}));

const Loader = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      minHeight: "315px",
      marginTop: -2,
    }}
  >
    <CircularProgress size={56} />
  </Box>
);

const Content = ({
  decimals,
  ownerBalance,
  symbol,
}: {
  decimals: number;
  ownerBalance: number;
  symbol: string;
}) => {
  const [quantity, setQuantity] = useState(CC_DEFAULT_QUANTITY);
  const [email, setEmail] = useState("");
  const [quantityText, setQuantityText] = useState(quantity.toString())
  const { classes, cx } = useStyles();

  const handleChange = (value: string) => {
    const pendingNumber = parseInt(value, 10);
    if (!Number.isNaN(pendingNumber) && pendingNumber >= 1 && pendingNumber <= 10) {
      setQuantity(pendingNumber);
    }
    setQuantityText(value);
  };

  const handleBlur = () => {
    setQuantityText(quantity.toString());
  };

  const handleSubmit = async () => {
    const amount = quantity * Math.pow(10, decimals);
    if (amount > ownerBalance) {
      ioc.alertService.notify('Insufficient wallet balance');
      return;
    }
    await ioc.erc20Service.approve(CC_PAYMENT_GATEWAY_ADDRESS, amount);
    await ioc.paymentGatewayService.sendUSDT(amount, email);
    ioc.routerService.push("/done-page");
  };

  const handleError = (error: Error) => {
    const message = getErrorMessage(error);
    console.error({ message });
    ioc.alertService.notify("An error acquired while transaction");
  };

  const totalUsdt = quantity * CC_LESSON_PRICE;

  return (
    <Box className={classes.content}>
      <Box className={classes.table}>
        <Typography className={classes.bold}>Lesson price</Typography>
        <Typography variant="body2">
          {CC_LESSON_PRICE} {symbol}
        </Typography>
        <Typography className={classes.bold}>Wallet supply</Typography>
        <Typography variant="body2">
          {formatAmount(Math.floor(ownerBalance / Math.pow(10, decimals)))} {symbol}
        </Typography>
        <Typography className={classes.bold}>
          Contact email
        </Typography>
        <InputBase
          value={email}
          type="email"
          placeholder="tripolskypetr@gmail.com"
          onChange={({ target }) => setEmail(target.value)}
        />
        <Typography className={cx(classes.noBorder, classes.bold)}>
          Checkout lessons
        </Typography>
        <InputBase
          className={classes.noBorder}
          value={quantityText}
          onChange={({ target }) => handleChange(target.value)}
          onBlur={() => handleBlur()}
        />
      </Box>
      <div className={classes.stretch} />
      <ActionButton
        size="large"
        fullWidth
        sx={{ width: "calc(100% - 20px)", ml: "10px" }}
        onLoadStart={() => ioc.layoutService.setAppbarLoader(true)}
        onLoadEnd={() => ioc.layoutService.setAppbarLoader(false)}
        fallback={handleError}
        onClick={handleSubmit}
      >
        Send {totalUsdt}{' '}{symbol}
      </ActionButton>
    </Box>
  );
};

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
