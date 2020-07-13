import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { sequelize } from './models'
import { User } from './models/User'
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
// initializing express app
const app: express.Application = express()

// MIDDLEWARE
app.use(express.json())
app.use(cors())
app.use(helmet())

sequelize
    .authenticate()
    .then(() => console.log('Connect to db'))
    .catch((err) => {
        console.log(err)
    })

app.get('/', async (req: Request, res: Response) => {
    try {
        const users = await User.findAll()
        return res.json(users)
    } catch (error) {
        console.log(error)
    }
})
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
