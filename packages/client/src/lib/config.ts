import { provide } from 'react-declarative';

import EthersService from "./services/EthersService";
import ContractService from "./services/ContractService";
import RouterService from './services/RouterService';
import AlertService from './services/AlertService';
import LayoutService from './services/LayoutService';
import ConnectService from './services/ConnectService';

import TYPES from "./types";

provide(TYPES.contractService, () => new ContractService());
provide(TYPES.ethersService, () => new EthersService());
provide(TYPES.routerService, () => new RouterService());
provide(TYPES.alertService, () => new AlertService());
provide(TYPES.layoutService, () => new LayoutService());
provide(TYPES.connectService, () => new ConnectService());
