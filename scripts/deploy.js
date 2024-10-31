const { ethers } = require("hardhat");

async function main() {
    // Get the contract factories
    const Messages = await ethers.getContractFactory("Messages");
    const Registration = await ethers.getContractFactory("Registration");

    // Deploy contracts
    const messages = await Messages.deploy();
    const registration = await Registration.deploy();

    await messages.waitForDeployment();
    await registration.waitForDeployment();

    // Log contract addresses after deployment
    console.log("Messages contract deployed to:", await messages.getAddress());
    console.log("Registration contract deployed to:", await registration.getAddress());
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});