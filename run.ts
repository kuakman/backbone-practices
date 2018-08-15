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
	const data = { property: 2 };
	res.json(data);
});

app.listen(3000);
