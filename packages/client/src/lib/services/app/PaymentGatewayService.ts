import { makeAutoObservable, runInAction } from "mobx";
import { inject, singleshot, Subject, toBytes32, fromBytes32 } from "react-declarative";

import {
    ethers,
    BaseContract,
    /*BigNumber,*/
} from "ethers";

import EthersService from "../base/EthersService";

import { CC_PAYMENT_GATEWAY_ABI } from "../../../config/params";
import { CC_PAYMENT_GATEWAY_ADDRESS } from "../../../config/params";

import TYPES from "../../types";

type IContract = BaseContract & Record<string, (...args: any[]) => Promise<any>>;

export class PaymentGatewayService {

    private readonly ethersService = inject<EthersService>(TYPES.ethersService);

    public readonly transferSubject = new Subject<{
        sender: string;
        amount: number;
        data: string;
    }>();

    private _instance: IContract = null as never;

    get isContractConnected() {
        return !!this._instance;
    };

    constructor() {
        makeAutoObservable(this);
    };

    getDeployBlock = async () => Number(await this._instance.deployBlock());

    sendUSDT = async (_amount: number, _data: string) => {
        const result = await this._instance.sendUSDT(String(_amount), toBytes32(_data));
        const rc = await result.wait();
        const event = rc.events.find((event: any) => event.event === 'Transfer');
        const [sender, amount, data] = event.args;
        return {
            sender,
            amount: Number(amount),
            data: fromBytes32(data),
        };
    };

    getTransferList = async () => {
        const eventSignature = 'Transfer(address,uint256,bytes32)';
        const eventTopic = ethers.utils.id(eventSignature);
        const deployBlock = await this.getDeployBlock();
        const currentBlock = await this.ethersService.provider.getBlockNumber();
        const parser = new ethers.utils.Interface(CC_PAYMENT_GATEWAY_ABI);
        const rawLogs = await this.ethersService.provider.getLogs({
            address: CC_PAYMENT_GATEWAY_ADDRESS,
            topics: [eventTopic],
            fromBlock: deployBlock, 
            toBlock: currentBlock,
        });
        return rawLogs.map((log, idx) => {
            const parsedLog = parser.parseLog(log);
            const [sender, amount, data] = parsedLog.args;
            return {
                id: `${idx}`,
                sender,
                amount: Number(amount),
                data: fromBytes32(data),
            };
        });
    };

    prefetch = singleshot(async () => {
        console.log("PaymentGatewayService prefetch started");
        try {
            const deployedCode = await this.ethersService.getCode(CC_PAYMENT_GATEWAY_ADDRESS);
            if (deployedCode === '0x') {
                throw new Error('PaymentGatewayService contract not deployed');
            }
            const instance = new ethers.Contract(
                CC_PAYMENT_GATEWAY_ADDRESS,
                CC_PAYMENT_GATEWAY_ABI,
                this.ethersService.getSigner(),
            ) as IContract;
            runInAction(() => this._instance = instance);
            this.ethersService.provider.once("block", () => {
                instance.on('Transfer', (sender: string, amount: BigInt, data: string) => {
                    this.transferSubject.next({
                        sender,
                        amount: Number(amount),
                        data: fromBytes32(data),
                    });
                });
            });
        } catch (e) {
            console.warn('PaymentGatewayService prefetch failed', e);
        }
    });

};

export default PaymentGatewayService;
