import express, {Express, Request, Response} from 'express';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Working');
})

app.listen(3333, () => {
    console.log('Server is running on port 3333!');
})

export default app;
