import CC_PAYMENT_GATEWAY_ABI from "../contract/payment-gateway.abi.json";
import CC_ERC20_ABI from "../contract/erc20.abi.json";

import ADDRESSES from "../contract/instances.deployed.json";

const CC_ERC20_ADDRESS = ADDRESSES.erc20;
const CC_PAYMENT_GATEWAY_ADDRESS = ADDRESSES.gateway;
const CC_LESSON_PRICE = 25;
const CC_DEFAULT_QUANTITY = 1;

export {
  CC_ERC20_ADDRESS,
  CC_PAYMENT_GATEWAY_ADDRESS,
  CC_DEFAULT_QUANTITY,
  CC_LESSON_PRICE,
  CC_ERC20_ABI,
  CC_PAYMENT_GATEWAY_ABI,
};
