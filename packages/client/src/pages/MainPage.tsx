import { useState } from "react";
import { observer } from "mobx-react-lite";

import {
  OneTyped,
  FieldType,
  TypedField,
  PortalView,
  RevealView,
  ActionButton,
  getErrorMessage,
} from "react-declarative";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import Logo from "../components/common/Logo";

import { CC_PAYMENT_GATEWAY_ADDRESS } from "../config/params";

import ioc from "../lib/ioc";

const MAX_AMOUNT_DIGITS = 5;

const MAX_AMOUNT = 10 ** MAX_AMOUNT_DIGITS - 1;
const MAX_AMOUNT_TMPL = MAX_AMOUNT.toString().split("").fill("0").join("");

interface IData {
  quantity: string;
  email: string;
}

const fields: TypedField<IData>[] = [
  {
    type: FieldType.Text,
    title: "Quantity",
    name: "quantity",
    defaultValue: "1",
    fieldRightMargin: "0",
    inputFormatterTemplate: MAX_AMOUNT_TMPL,
    inputFormatterAllowed: /([0-9])/g,
    isInvalid: ({ quantity: Q }) => {
      const quantity = parseInt(Q) || 0;
      if (quantity === 0 && quantity > MAX_AMOUNT) {
        return "Invalid quantity";
      }
      return null;
    },
  },
  {
    type: FieldType.Text,
    fieldBottomMargin: '1',
    fieldRightMargin: "0",
    title: "Email",
    name: "email",
    inputType: "email",
    defaultValue: "tripolskypetr@gmail.com",
    isInvalid({ email }) {
      const expr = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      if (!expr.test(email)) {
        return "Invalid email address";
      } else {
        return null;
      }
    },
  },
];

const Content = observer(() => {
  const [data, setData] = useState<IData | null>(null);

  const handleChange = (data: IData) => {
    setData(data);
  };

  const handleInvalid = () => {
    setData(null);
  };

  const handleSubmit = async () => {
    if (!data) {
      return;
    }
    const quantity = parseInt(data.quantity) * Math.pow(10, await ioc.erc20Service.getDecimals());
    await ioc.erc20Service.approve(CC_PAYMENT_GATEWAY_ADDRESS, quantity);
    await ioc.paymentGatewayService.sendUSDT(quantity, data.email);
    ioc.routerService.push('/done-page');
  };

  const handleError = (error: Error) => {
    const message = getErrorMessage(error);
    console.error({ message });
    ioc.alertService.notify('An error acquired while transaction');
  };

  return (
    <>
      <OneTyped<IData>
        dirty
        onInvalid={handleInvalid}
        onChange={handleChange}
        fields={fields}
      />
      <ActionButton
        size="large"
        disabled={!data}
        onLoadStart={() => ioc.layoutService.setAppbarLoader(true)}
        onLoadEnd={() => ioc.layoutService.setAppbarLoader(false)}
        fallback={handleError}
        onClick={handleSubmit}
      >
        Send tokens
      </ActionButton>
    </>
  );
});

export const MainPage = observer(() => (
  <PortalView>
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: (theme) => theme.palette.background.default,
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: '15px',
        padding: '15px',
        "& > *:nth-of-type(1)": {
          width: "unset !important",
        },
      }}
    >
      <RevealView>
        <Paper
          sx={{
            position: "relative",
            overflow: "hidden",
            p: 1,
            pt: 3,
            pb: 3
          }}
        >
          <Stack direction="column" gap="15px">
            <Logo />
            <Content />
          </Stack>
        </Paper>
      </RevealView>
    </Box>
  </PortalView>
));

export default MainPage;
