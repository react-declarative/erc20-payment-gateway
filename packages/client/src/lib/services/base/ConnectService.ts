import { makeAutoObservable } from "mobx";
import { inject, singleshot } from "react-declarative";

import RouterService from "./RouterService";
import EthersService from "./EthersService";
import LayoutService from "./LayoutService";
import AlertService from "./AlertService";

import TYPES from "../../types";

export class ConnectPageService {

    private readonly ethersService = inject<EthersService>(TYPES.ethersService);
    private readonly routerService = inject<RouterService>(TYPES.routerService);
    private readonly layoutService = inject<LayoutService>(TYPES.layoutService);
    private readonly alertService = inject<AlertService>(TYPES.alertService);

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

    handleAddBsc = async () => {
        await this.ethersService.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: '0x38',
                    chainName: 'Binance Smart Chain',
                    nativeCurrency: {
                        name: 'Binance Coin',
                        symbol: 'BNB',
                        decimals: 18
                    },
                    rpcUrls: ['https://bsc-dataseed.binance.org/'],
                    blockExplorerUrls: ['https://bscscan.com'],
                }
            ],
        });
    };

    handleSwitchBsc = async () => {
        try {
            await this.ethersService.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x38' }],
            }).catch(async (error: any) => {
                if (error.code === 4902) {
                    await this.handleAddBsc();
                    await this.ethersService.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x38' }],
                    })
                }
                throw error;
            });
        } catch (error: any) {
            this.alertService.notify('It looks like the confirmation has been rejected');
        }
    };

};

export default ConnectPageService;
