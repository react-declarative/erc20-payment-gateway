import { provide } from 'react-declarative';

import EthersService from "./services/base/EthersService";
import RouterService from './services/base/RouterService';
import AlertService from './services/base/AlertService';
import LayoutService from './services/base/LayoutService';
import ConnectService from './services/base/ConnectService';
import CredentialsService from './services/base/CredentialsService';

import PaymentGatewayService from "./services/app/PaymentGatewayService";
import Erc20Service from "./services/app/Erc20Service";

import TYPES from "./types";

provide(TYPES.paymentGatewayService, () => new PaymentGatewayService());
provide(TYPES.erc20Service, () => new Erc20Service());

provide(TYPES.ethersService, () => new EthersService());
provide(TYPES.routerService, () => new RouterService());
provide(TYPES.alertService, () => new AlertService());
provide(TYPES.layoutService, () => new LayoutService());
provide(TYPES.connectService, () => new ConnectService());
provide(TYPES.credentialsService, () => new CredentialsService());
