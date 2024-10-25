// Ensure MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
  console.log('MetaMask is installed!');
} else {
  alert('Please install MetaMask to use this app');
}

// Connect to Ethereum wallet and handle registration/login
const loginButton = document.getElementById('login');
const accountDisplay = document.getElementById('account');
const sendMessageForm = document.getElementById('sendMessageForm');

let userAccount = '';

loginButton.addEventListener('click', async () => {
  try {
      // Request user's account via MetaMask
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      userAccount = accounts[0];
      accountDisplay.innerText = `Connected: ${userAccount}`;

      // Check registration status and register if necessary
      await checkAndRegisterUser();

      // Show the message form once logged in
      sendMessageForm.style.display = 'block';

      // Fetch messages for the logged-in user (recipient)
      fetchMessages();
  } catch (error) {
      console.error('Error connecting to MetaMask or registering user:', error);
  }
});

// Web3.js initialization
const web3 = new Web3(window.ethereum);

// Contract addresses and ABI (Add your deployed addresses here)
const messagesContractAddress = "CONTRACT_ADDRESS"; // Replace with actual contract address
const registrationContractAddress = "CONTRACT_ADDRESS"; // Replace with actual contract address

// Contract ABIs
const messagesAbi = [
  {
    "inputs": [],
    "name": "getMessagesForRecipient",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "messages",
    "outputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "encryptedMessage",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "encryptedMessage",
        "type": "string"
      }
    ],
    "name": "sendMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const registrationAbi = [
  {
    "inputs": [],
    "name": "isRegistered",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "registeredUsers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contracts
const messagesContract = new web3.eth.Contract(messagesAbi, messagesContractAddress);
const registrationContract = new web3.eth.Contract(registrationAbi, registrationContractAddress);

// Generate AES Key using PBKDF2 and passphrase
const passphrase = 'user-specific-passphrase'; // Use a secure passphrase
const salt = CryptoJS.lib.WordArray.random(128 / 8); // Generate a random salt
const aesKey = CryptoJS.PBKDF2(passphrase, salt, {
  keySize: 128 / 32, // 128-bit AES key
  iterations: 1000   // Number of iterations (increases security)
});

// encrypt the message using AES
function encryptMessage(message, aesKey) {
  const encryptedMessage = CryptoJS.AES.encrypt(message, aesKey.toString()).toString();
  return encryptedMessage;
}

// decrypt the message using AES
function decryptMessage(encryptedMessage, aesKey) {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, aesKey.toString());
  const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
}

// Check if registered, if not register them
async function checkAndRegisterUser() {
  try {
      const isRegistered = await registrationContract.methods.isRegistered().call({ from: userAccount });
      if (!isRegistered) {
          await registrationContract.methods.registerUser().send({ from: userAccount });
          console.log('User registered:', userAccount);
      } else {
          console.log('User already registered:', userAccount);
      }
  } catch (error) {
      console.error('Error checking or registering user:', error);
  }
}

// Send encrypted message to a specific recipient
sendMessageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const recipient = document.getElementById('recipient').value; // Get the recipient's address
  const message = document.getElementById('message').value;

  // Encrypt the message using AES.js function
  const encryptedMessage = encryptMessage(message, aesKey);

  try {
      // Send the encrypted message to the recipient on the blockchain
      await messagesContract.methods.sendMessage(recipient, encryptedMessage).send({ from: userAccount });
      console.log('Message sent to:', recipient);
  } catch (error) {
      console.error('Error sending message:', error);
  }
});

// Fetch and decrypt messages for the logged-in user
async function fetchMessages() {
  try {
      const messages = await messagesContract.methods.getMessagesForRecipient().call({ from: userAccount });
      const decryptedMessages = messages.map((msg) => decryptMessage(msg, aesKey)); // Decrypt each message
      displayMessages(decryptedMessages);
  } catch (error) {
      console.error('Error fetching messages:', error);
  }
}

function displayMessages(messages) {
  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML = '';
  messages.forEach((message, index) => {
      const messageElement = document.createElement('p');
      messageElement.textContent = `Message ${index + 1}: ${message}`;
      messagesDiv.appendChild(messageElement);
  });
}

// Fetch messages on page load
fetchMessages();
