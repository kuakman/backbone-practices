/**
 *	Main Run
 **/
import * as express from 'express';

const app = express();

app.use('/', express.static('./src'))

app.get('/test/get/json', (res: express.Response) => {
	const data = { property: 2 };
	res.json(data);
});

app.post('/test/post/json', (req: express.Request, res: express.Response) => {
	const data = {
		property: 2,
		shipments: [
			{ id: 1, status: { id: 1, name: 'Preparing to Shipment' } },
			{ id: 2, status: { id: 1, name: 'Preparing to Shipment' } },
			{ id: 3, status: { id: 2, name: 'Shipped' } },
			{ id: 4, status: { id: 3, name: 'Delivered' } }
		]
	};
	res.json(data);
});

app.listen(3000);
