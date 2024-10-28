const { ethers } = require("hardhat");

async function main() {
    // Get the contract factories
    const Messages = await ethers.getContractFactory("Messages");
    const Registration = await ethers.getContractFactory("Registration");

    // Deploy contracts and get contract addresses
    const messages = await Messages.deploy();
    const registration = await Registration.deploy();

    // Log contract addresses after deployment
    console.log("Messages contract deployed to:", messages.address);
    console.log("Registration contract deployed to:", registration.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
