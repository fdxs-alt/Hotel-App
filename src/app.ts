import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { sequelize } from './models'
import { User } from './models/User'
import dotenv from 'dotenv'
import Auth from './routes/AuthRoutes'
import Hotel from './routes/HotelRoutes'
import Room from './routes/RoomRoutes'
import Reservation from './routes/ReservationRoutes'
import UserRoutes from './routes/UserRoutes'
import Opinions from './routes/OpinionsRoutes'
import passport from 'passport'
import strategy from './utils/passport'
import { handleErrors, notFound } from './utils/ErrorHandling'

dotenv.config({ path: './.env' })
// initializing express app
const app: express.Application = express()

// sequlize auth
sequelize
    .authenticate()
    .then(() => console.log('Connect to db'))
    .catch((err) => console.log(err))
// MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())
passport.use(strategy)
app.use(passport.initialize())

app.get('/', async (req: Request, res: Response) => {
    try {
        const users = await User.findAll()
        return res.json(users)
    } catch (error) {
        console.log(error)
    }
})
// Routes

app.use('/auth', Auth)
app.use('/hotels', Hotel)
app.use('/rooms', Room)
app.use('/reservation', Reservation)
app.use('/user', UserRoutes)
app.use('/opinions', Opinions)
// Error handler
app.use(notFound)

app.use(handleErrors)
// seting up server
const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
