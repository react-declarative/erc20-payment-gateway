import { makeAutoObservable, runInAction } from "mobx";
import { inject, singleshot, Subject } from "react-declarative";

import {
    ethers,
    BaseContract,
    /*BigNumber,*/
} from "ethers";

import EthersService from "./EthersService";

import { CC_CONTRACT_ADDRESS } from "../../config/params";
import { CC_CONTRACT_ABI } from "../../config/params";

import TYPES from "../types";

type IContract = BaseContract & Record<string, (...args: any[]) => Promise<any>>;

export class ContractService {

    private readonly ethersService = inject<EthersService>(TYPES.ethersService);

    public readonly updateSubject = new Subject<void>();

    private _instance: IContract = null as never;

    get isContractConnected() {
        return !!this._instance;
    };

    constructor() {
        makeAutoObservable(this);
    };

    getPendingTodoId = async () => Number(await this._instance.pendingTodoId());

    getTodoById = async (id: number) => {
        const todoItem = await this._instance.todoMap(id);
        return {
            id: Number(todoItem.id),
            content: String(todoItem.content),
            owner: String(todoItem.owner),
            isDeleted: Boolean(todoItem.isDeleted),
        };
    };

    addTodo = async (content: string) => await this._instance.addTodo(content);

    setTodoText = async (id: number, content: string) => await this._instance.setTodoText(id, content);

    removeTodoById = async (id: number) => await this._instance.removeTodo(id);

    todosOfOwner = async () => {
        const todoIds: number[] = (await this._instance.todosOfOwner()).map((bigint: any) => Number(bigint));
        return await Promise.all(todoIds.map((id) => this.getTodoById(id)));
    };

    todosOfEveryone = async () => {
        const pendingId = await this.getPendingTodoId();
        const totalIds = [...Array(pendingId).keys()];
        return await Promise.all(totalIds.map((id) => this.getTodoById(id)));
    };

    prefetch = singleshot(async () => {
        console.log("ContractService prefetch started");
        try {
            const deployedCode = await this.ethersService.getCode(CC_CONTRACT_ADDRESS);
            if (deployedCode === '0x') {
                throw new Error('ContractService contract not deployed');
            }
            const instance = new ethers.Contract(
                CC_CONTRACT_ADDRESS,
                CC_CONTRACT_ABI,
                this.ethersService.getSigner(),
            ) as IContract;
            runInAction(() => this._instance = instance);
            instance.on('update', this.updateSubject.next);
        } catch (e) {
            console.warn('ContractService prefetch failed', e);
        }
    });

};

export default ContractService;
