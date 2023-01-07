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

contract TodoList {

    struct Todo {
        uint id;
        string content;
        address owner;
        bool isDeleted;
    }

    uint256 public pendingTodoId;

    mapping (uint256 => Todo) public todoMap;

    function todosOfOwner() public view returns (uint256[] memory) {
        uint256 todosLength = pendingTodoId;
        uint256[] memory ownedTodoDirtyIds = new uint256[](todosLength);
        uint256 ownedTodoIdx = 0;
        for (uint id = 0; id != todosLength; id++) {
            Todo memory todo = todoMap[id];
            if (todo.owner == msg.sender && !todo.isDeleted) {
                ownedTodoDirtyIds[ownedTodoIdx] = todo.id;
                ownedTodoIdx++;
            }
        }
        uint256[] memory ownedTodoIds = new uint256[](ownedTodoIdx);
        for (uint id = 0; id != ownedTodoIdx; id++) {
            ownedTodoIds[id] = ownedTodoDirtyIds[id];
        }
        return ownedTodoIds;
    }

    function addTodo(string memory _content) public {
        uint256 currentId = pendingTodoId++;
        Todo memory todo;
        todo.id = currentId;
        todo.content = _content;
        todo.owner = msg.sender;
        todoMap[currentId] = todo;
        emit update();
    }

    function removeTodo(uint256 _id) public {
        Todo storage todo = todoMap[_id];
        require(todo.owner == msg.sender, 'You are not the owner of that todo');
        todo.isDeleted = true;
        emit update();
    }

    function setTodoText(uint256 _id, string memory _content) public {
        Todo storage todo = todoMap[_id];
        require(todo.owner == msg.sender, 'You are not the owner of that todo');
        todo.content = _content;
        emit update();
    }

    event update();

}
