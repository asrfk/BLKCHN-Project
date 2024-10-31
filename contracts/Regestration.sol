// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Registration {
    mapping(address => bool) public registeredUsers;

    function registerUser() public {
        require(!registeredUsers[msg.sender], "User already registered");
        registeredUsers[msg.sender] = true;
    }

    function isRegistered() public view returns (bool) {
        return registeredUsers[msg.sender];
    }
}