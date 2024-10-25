// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Messages {
    struct Message {
        address sender;
        address recipient;
        string encryptedMessage;
    }

    Message[] public messages;

    // Function to send a message to a specific recipient
    function sendMessage(address recipient, string memory encryptedMessage) public {
        messages.push(Message(msg.sender, recipient, encryptedMessage));
    }

    // Function to get messages sent to the caller (recipient)
    function getMessagesForRecipient() public view returns (string[] memory) {
        uint messageCount = 0;

        // First, count how many messages are for the recipient
        for (uint i = 0; i < messages.length; i++) {
            if (messages[i].recipient == msg.sender) {
                messageCount++;
            }
        }

        // Collect all messages for the recipient
        string[] memory recipientMessages = new string[](messageCount);
        uint index = 0;
        for (uint i = 0; i < messages.length; i++) {
            if (messages[i].recipient == msg.sender) {
                recipientMessages[index] = messages[i].encryptedMessage;
                index++;
            }
        }
        return recipientMessages;
    }
}
