import { inject } from 'react-declarative';

import EthersService from "./services/base/EthersService";
import RouterService from './services/base/RouterService';
import AlertService from './services/base/AlertService';
import ConnectService from './services/base/ConnectService';
import LayoutService from './services/base/LayoutService';
import CredentialsService from './services/base/CredentialsService';

import PaymentGatewayService from "./services/app/PaymentGatewayService";
import Erc20Service from "./services/app/Erc20Service";

import "./config"

import TYPES from "./types";

const baseServices = {
    ethersService: inject<EthersService>(TYPES.ethersService),
    routerService: inject<RouterService>(TYPES.routerService),
    alertService: inject<AlertService>(TYPES.alertService),
    connectService: inject<ConnectService>(TYPES.connectService),
    layoutService: inject<LayoutService>(TYPES.layoutService),
    credentialsService: inject<CredentialsService>(TYPES.credentialsService),
};

const appServices = {
    paymentGatewayService: inject<PaymentGatewayService>(TYPES.paymentGatewayService),
    erc20Service: inject<Erc20Service>(TYPES.erc20Service),
};

export const ioc = {
    ...baseServices,
    ...appServices,
};

window.addEventListener('unhandledrejection', () => {
    ioc.routerService.push('/error-page');
});

/*window.addEventListener('error', () => {
    ioc.routerService.push('/error-page');
});*/

(window as any).ioc = ioc;

export default ioc;
