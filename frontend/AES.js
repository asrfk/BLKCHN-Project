const CryptoJS = require('crypto-js');

// AES Encryption
function encryptMessage(message, aesKey) {
    const encryptedMessage = CryptoJS.AES.encrypt(message, aesKey).toString();
    return encryptedMessage;
}

// AES Decryption
function decryptMessage(encryptedMessage, aesKey) {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, aesKey);
    const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedMessage;
}