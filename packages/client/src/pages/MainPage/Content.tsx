import { useState } from "react";
import { alpha, Theme } from "@mui/material";

import { makeStyles } from "../../styles";

import { ActionButton, getErrorMessage, formatAmount } from "react-declarative";

import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";

import {
  CC_LESSON_PRICE,
  CC_DEFAULT_QUANTITY,
  CC_PAYMENT_GATEWAY_ADDRESS,
} from "../../config/params";

import ioc from "../../lib/ioc";

const useStyles = makeStyles()((theme: Theme) => ({
  content: {
    display: "flex",
    flexDirection: "column",
    minHeight: 315,
    paddingBottom: "12px",
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

export const Content = ({
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
  const [quantityText, setQuantityText] = useState(quantity.toString());
  const { classes, cx } = useStyles();

  const handleChange = (value: string) => {
    const pendingNumber = parseInt(value, 10);
    if (
      !Number.isNaN(pendingNumber) &&
      pendingNumber >= 1 &&
      pendingNumber <= 10
    ) {
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
      ioc.alertService.notify("Insufficient wallet balance");
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
          {formatAmount(Math.floor(ownerBalance / Math.pow(10, decimals)))}{" "}
          {symbol}
        </Typography>
        <Typography className={classes.bold}>Contact email</Typography>
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
        Send {totalUsdt} {symbol}
      </ActionButton>
    </Box>
  );
};

export default Content;
