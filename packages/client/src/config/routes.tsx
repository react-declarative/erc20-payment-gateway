import { ISwitchItem } from "react-declarative";

import ConnectPage from "../pages/ConnectPage";
import PermissionPage from "../pages/PermissionPage";
import NoMetamaskPage from "../pages/NoMetamaskPage";
import NotDeployedPage from "../pages/NotDeployedPage";
import ErrorPage from "../pages/ErrorPage";

import MainPage from "../pages/MainPage";
import AdminPage from "../pages/AdminPage";

import ioc from "../lib/ioc";

export const routes: ISwitchItem[] = [
  {
    path: "/",
    redirect: "/connect-page",
  },
  {
    path: "/connect-page",
    element: ConnectPage,
    prefetch: () => ioc.ethersService.prefetch(),
    redirect: () => {
      let isOk = true;
      isOk = isOk && ioc.ethersService.isMetamaskAvailable;
      isOk = isOk && ioc.ethersService.isProviderConnected;
      isOk = isOk && ioc.ethersService.isAccountEnabled;
      if (isOk) {
        return "/main-page";
      }
      return null;
    },
  },
  {
    path: "/main-page",
    element: MainPage,
    prefetch: async () => await Promise.all([
      ioc.erc20Service.prefetch(),
      ioc.paymentGatewayService.prefetch(),
    ]),
    redirect: () => {
      if (!ioc.paymentGatewayService.isContractConnected) {
        return "/notdeployed-page";
      }
      if (!ioc.erc20Service.isContractConnected) {
        return "/notdeployed-page";
      }
      return null;
    },
  },
  {
    path: "/admin-page",
    element: AdminPage,
    prefetch: async () => await Promise.all([
      ioc.erc20Service.prefetch(),
      ioc.paymentGatewayService.prefetch(),
    ]),
    redirect: () => {
      if (!ioc.paymentGatewayService.isContractConnected) {
        return "/notdeployed-page";
      }
      if (!ioc.erc20Service.isContractConnected) {
        return "/notdeployed-page";
      }
      return null;
    },
  },
  {
    path: "/permission-page",
    element: PermissionPage,
  },
  {
    path: "/nometamask-page",
    element: NoMetamaskPage,
  },
  {
    path: "/notdeployed-page",
    element: NotDeployedPage,
  },
  {
    path: "/error-page",
    element: ErrorPage,
  },
];

export default routes;
