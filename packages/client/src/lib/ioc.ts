import { inject } from 'react-declarative';

import ContractService from "./services/ContractService";
import EthersService from "./services/EthersService";
import RouterService from './services/RouterService';
import AlertService from './services/AlertService';
import ConnectService from './services/ConnectService';
import LayoutService from './services/LayoutService';

import "./config"

import TYPES from "./types";

const baseServices = {
    contractService: inject<ContractService>(TYPES.contractService),
    ethersService: inject<EthersService>(TYPES.ethersService),
    routerService: inject<RouterService>(TYPES.routerService),
    alertService: inject<AlertService>(TYPES.alertService),
    connectService: inject<ConnectService>(TYPES.connectService),
    layoutService: inject<LayoutService>(TYPES.layoutService),
};

export const ioc = {
    ...baseServices,
};

window.addEventListener('unhandledrejection', () => {
    ioc.routerService.push('/error-page');
});

/*window.addEventListener('error', () => {
    ioc.routerService.push('/error-page');
});*/

// if (process.env.REACT_APP_STAGE === 'dev') {
    (window as any).ioc = ioc;
// }

export default ioc;
