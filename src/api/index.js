import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import Tx from 'ethereumjs-tx';

export default ({ config, db, web3 }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.get("/createWallet", (req, res) => {
		var wallet = web3.eth.accounts.create();
		var response = {
			privateKey: wallet.privateKey,
			address: wallet.address
		}
		res.json(response);
	})

	api.get("/getBalance/:address", (req, res) => {
		web3.eth.getBalance(req.params.address)
			.then(balance => res.json(balance))
			.catch(err => res.json(err));
	})

	api.post("/transaction", (req, res) => {
		var privateKey = req.body.privateKey;
		var destination = req.body.destination;
		var amount = "0x" + req.body.amount;
		var account = web3.eth.accounts.privateKeyToAccount(privateKey);
		var tx = {
			from: account.address,
			to: destination,
			value: amount,
		}
	})

	return api;
}
