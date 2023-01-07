# erc20-payment-gateway

> A payment gateway for any `IERC20` tokens (USDT) with testbed on top of [TestERC20](https://stackoverflow.com/questions/75043524/minimal-erc20-contract-for-testing/75043525#75043525) token

## Contract source code

```solidity
contract PaymentGatewayContract {

    IERC20 private erc20;
    address owner;

    uint256 public deployBlock;

    constructor(address _erc20Address) {
        erc20 = IERC20(_erc20Address);
        owner = msg.sender;
        deployBlock = block.number;
    }

    function sendUSDT(uint256 _amount, bytes32 _data) public {
        require(erc20.balanceOf(msg.sender) >= _amount, "Insufficient funds");
        erc20.transferFrom(msg.sender, owner, _amount);
        emit Transfer(msg.sender, _amount, _data);
    }

    event Transfer(address indexed sender, uint256 amount, bytes32 _data);

}
```
