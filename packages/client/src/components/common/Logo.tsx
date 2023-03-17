import { useMemo } from "react";
import { Async, typo } from 'react-declarative';
import { darken, Theme } from "@mui/material";
import { makeStyles } from "../../styles/makeStyles";

import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

import { observer } from "mobx-react-lite";

import ioc from '../../lib/ioc';

const LOGO_HEIGHT = 255;

const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    position: "absolute",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: LOGO_HEIGHT,
    background: darken(theme.palette.background.paper, 0.12),
  },
  adjust: {
    paddingBottom: LOGO_HEIGHT,
  },
}));

const Loader = () => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            '& .MuiCircularProgress-root': {
                height: 40,
                width: 40,
            }
        }}
    >
        <CircularProgress
            size="small"
        />
    </Box>
);

export const Logo = observer(() => {
  const { classes } = useStyles();

  const isEtherscanAvailable = useMemo(() => {
    let isOk = true;

    isOk = isOk && ioc.ethersService.isMetamaskAvailable;
    isOk = isOk && ioc.ethersService.isProviderConnected;
    isOk = isOk && ioc.ethersService.isAccountEnabled;

    isOk = isOk && ioc.paymentGatewayService.isContractConnected;
    isOk = isOk && ioc.erc20Service.isContractConnected;

    return isOk;
  }, []);

  return (
    <>
      <Box className={classes.root}>
        <Stack alignItems="center" gap="15px">
          <Avatar
            src="/avatar.png"
            alt="Peter Tripolsky"
            sx={{ width: 128, height: 128 }}
          />
          <Typography variant="h6" sx={{ mt: -2 }}>Peter Tripolsky</Typography>
          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: (theme: Theme) => theme.palette.text.secondary }}
            >
                <Async payload={isEtherscanAvailable} Loader={Loader} throwError>
                    {async () => {
                        if (isEtherscanAvailable) {
                            const address = await ioc.paymentGatewayService.getOwner();
                            return (
                                <>
                                    Direct etherscan address is
                                    <br />
                                    <Link target="_blank" href={`https://etherscan.io/address/${address}`}>
                                        {address}
                                    </Link>
                                </>
                            );
                        }
                        return "Dotation recipient";
                    }}
                </Async>
            </Typography>
        </Stack>
      </Box>
      <div className={classes.adjust} />
    </>
  );
});

export default Logo;
