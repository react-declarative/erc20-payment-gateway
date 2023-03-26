import { inject } from 'react-declarative';

import EthersService from './EthersService';

import {
    CC_ERC20_ADDRESS,
    CC_PAYMENT_GATEWAY_ADDRESS,
    CC_PAYMENT_GATEWAY_ABI,
    CC_ERC20_ABI,
} from '../../../config/params';

import TYPES from '../../types';

const ETHEREUM_MAINNET_CHAINID = 1;
const BSC_CHAINID = 56;

export class CredentialsService {

    private readonly ethersService = inject<EthersService>(TYPES.ethersService);

    getErc20Address = () => Promise.resolve(CC_ERC20_ADDRESS);

    getPaymentGatewayAddress = () => Promise.resolve(CC_PAYMENT_GATEWAY_ADDRESS);

    getErc20Abi = () => Promise.resolve(CC_ERC20_ABI);
    
    getPaymentGatewayAbi = () => Promise.resolve(CC_PAYMENT_GATEWAY_ABI);

    getTokenStandart = async (): Promise<"ERC-20" | "BEP-20" | "UNKNOWN"> => {
        const chainId = await this.ethersService.getChainId();
        if (chainId === ETHEREUM_MAINNET_CHAINID) {
            return "ERC-20";
        }
        if (chainId === BSC_CHAINID) {
            return "BEP-20";
        }
        return "UNKNOWN";
    };

};

export default CredentialsService;
