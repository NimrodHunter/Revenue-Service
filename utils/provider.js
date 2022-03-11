require('dotenv').config()
const providers = require('ethers').providers;

const provider = new providers.InfuraProvider(process.env.NETWORK, process.env.INFURA_API_KEY);

module.exports = provider;