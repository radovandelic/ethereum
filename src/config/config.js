import config from './config.json';
import web3 from './web3'

config.gas = web3.utils.toHex('21000');
config.gasPrice = web3.utils.toHex('1000000000');
config.gasLimit = web3.utils.toHex('10000');

export default config;