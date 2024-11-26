import express, { Express } from 'express';
import dotenv from 'dotenv';
import routes from './routes/router';
const cors = require('cors');
import path from "path";

dotenv.config({ path: ".env" });
const PORT = process.env.PORT;
const app: Express = express();

app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.use(cors());
app.use(express.json());

// Use the service routes
app.use("/api", routes)

app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.APP_URL}`);
});


