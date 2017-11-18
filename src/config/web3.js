
import Web3 from "web3";

export default new Web3(Web3.givenProvider || new Web3.providers.HttpProvider('https://rinkeby.infura.io/'));