require("@nomiclabs/hardhat-ethers");
require("dotenv").config(); // Load environment variables from a .env file if needed for other purposes

module.exports = {
  solidity: "0.8.20",
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      // No accounts field since MetaMask will handle this
    },
  },
};
