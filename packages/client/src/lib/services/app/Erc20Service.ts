import { makeAutoObservable, runInAction } from "mobx";
import { inject, singleshot } from "react-declarative";

import {
    ethers,
    BaseContract,
    /*BigNumber,*/
} from "ethers";

import EthersService from "../base/EthersService";
import CredentialsService from "../base/CredentialsService";

import TYPES from "../../types";

type IContract = BaseContract & Record<string, (...args: any[]) => Promise<any>>;

export class Erc20Service {

    private readonly ethersService = inject<EthersService>(TYPES.ethersService);
    private readonly credentialsService = inject<CredentialsService>(TYPES.credentialsService);

    private _instance: IContract = null as never;

    get isContractConnected() {
        return !!this._instance;
    };

    constructor() {
        makeAutoObservable(this);
    };

    getSymbol = singleshot(async () => String(await this._instance.symbol()));

    getDecimals = singleshot(async () => Number(await this._instance.decimals()));

    balanceOf = async (address:  string) => Number(await this._instance.balanceOf(address));

    balanceOfOwner = async () => Number(await this._instance.balanceOf(await this.ethersService.getAccount()));

    transfer = async (address: string, amount: number) => Number(await this._instance.transfer(address, String(amount)));

    approve = async (address: string, amount: number) => {
        const result = await this._instance.approve(address, String(amount));
        await result.wait();
    };

    prefetch = singleshot(async () => {
        console.log("Erc20Service prefetch started");
        try {
            const ERC20_ADDRESS = await this.credentialsService.getErc20Address();
            const ERC20_ABI = await this.credentialsService.getErc20Abi();
            const deployedCode = await this.ethersService.getCode(ERC20_ADDRESS);
            if (deployedCode === '0x') {
                throw new Error('Erc20Service contract not deployed');
            }
            const instance = new ethers.Contract(
                ERC20_ADDRESS,
                ERC20_ABI,
                this.ethersService.getSigner(),
            ) as IContract;
            runInAction(() => this._instance = instance);
        } catch (e) {
            console.warn('Erc20Service prefetch failed', e);
        }
    });

};

export default Erc20Service;
