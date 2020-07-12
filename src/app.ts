import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
const app: express.Application = express();
// MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(helmet());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
