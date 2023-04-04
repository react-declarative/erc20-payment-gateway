// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract PaymentGatewayContract {

    IERC20 private erc20;
    address public owner;

    uint256 public deployBlock;

    constructor(address _erc20Address) {
        erc20 = IERC20(_erc20Address);
        owner = msg.sender;
        deployBlock = block.number;
    }

    function sendUSDT(uint256 _amount, bytes32 _data) public {
        uint256 allowance = erc20.allowance(msg.sender, address(this));

        require(allowance >= _amount, "ERC20 allowance not sufficient");
        bool transferSuccess = erc20.transferFrom(msg.sender, owner, _amount);

        require(transferSuccess, "Failed to transfer ERC20");
        emit Transfer(msg.sender, _amount, _data);
    }

    event Transfer(address indexed sender, uint256 amount, bytes32 _data);

}
