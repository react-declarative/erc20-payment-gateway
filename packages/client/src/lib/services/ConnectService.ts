import { makeAutoObservable } from "mobx";
import { inject, singleshot } from "react-declarative";

import RouterService from "./RouterService";
import EthersService from "./EthersService";
import LayoutService from "./LayoutService";

import TYPES from "../types";

export class ConnectPageService {

    private readonly ethersService = inject<EthersService>(TYPES.ethersService);
    private readonly routerService = inject<RouterService>(TYPES.routerService);
    private readonly layoutService = inject<LayoutService>(TYPES.layoutService);

    constructor() {
        makeAutoObservable(this);
    };

    handleConnectClick = singleshot(async () => {
        this.layoutService.setModalLoader(true);
        try {
            if (this.ethersService.isMetamaskAvailable) {
                await this.ethersService.enable()
                    .then(() => this.routerService.push('/main-page'))
                    .catch(() => this.routerService.push('/permission-page'))
            } else {
                this.routerService.push('/nometamask-page');
            }
        } finally {
            this.layoutService.setModalLoader(false);
        }
    });

};

export default ConnectPageService;
