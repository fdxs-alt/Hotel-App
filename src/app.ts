import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { sequelize } from './models';
// initializing express app
const app: express.Application = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(helmet());

sequelize
    .authenticate()
    .then(() => {
        console.log('Connect to db');
    })
    .catch((err) => {
        console.log(err);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
