import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config/config.json';
import web3 from './config/web3';

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));


//app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({
	limit: config.bodyLimit
}));



// connect to db
initializeDb(db => {

	// internal middleware
	app.use("/", middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db, web3 }));

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});

export default app;
