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
			.then(balance => res.json(web3.utils.fromWei(balance, 'ether')))
			.catch(err => res.json(err));
	})

	api.post("/transaction", (req, res) => {
		var amount = web3.utils.toHex(web3.utils.toWei(req.body.amount));
		var account = web3.eth.accounts.privateKeyToAccount(req.body.privateKey);
		web3.eth.getTransactionCount(account.address)
			.then(nonce => {
				var tx = {
					nonce: nonce,
					from: account.address,
					to: req.body.destination,
					value: amount,
					gas: config.gas,
					gasPrice: config.gasPrice,
					gasLimit: config.gasLimit
				}
				var privateKey = new Buffer(req.body.privateKey.substring(2, req.body.privateKey.length), 'hex');
				tx = new Tx(tx);
				tx.sign(privateKey);
				var stx = tx.serialize();

				web3.eth.sendSignedTransaction('0x' + stx.toString('hex'))
					.on('receipt', (response) => {
						res.json(response);
					})
					.catch(err => {
						res.json(err);
					})
			})
			.catch(err => {
				res.json(err);
			})
	})

	return api;
}
