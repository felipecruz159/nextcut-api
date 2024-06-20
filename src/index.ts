import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';

dotenv.config({path: ".env"});
const PORT = process.env.PORT;

const app: Express = express();

app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.APP_URL}`);
})

app.get('/', (req: Request, res: Response) => {
    res.send('Working');
})
