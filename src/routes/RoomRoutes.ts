import express, { Request, Response, NextFunction } from 'express'
import { Hotel } from '../models/Hotel'
import { Room } from '../models/Room'
import HttpException from '../utils/httpExceptions'
import passport from 'passport'
import { Op } from 'sequelize'

const router = express.Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rooms = await Room.findAll({})
        res.status(200).json(rooms)
    } catch (error) {
        next(new HttpException(500, 'An error occured'))
    }
})
router.get('/:roomId', async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = req.params
    try {
        const room = await Room.findByPk(roomId)
        if (!room) return next(new HttpException(400, "Can't find such a room"))
        res.status(200).json(room)
    } catch (error) {
        next(new HttpException(500, 'An error occured'))
    }
})
router.post(
    '/create/:hotelId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {
        const { hotelId } = req.params
        const { roomNumber, costPerNight, capacity, numberOfBeds, description } = req.body
        if (!roomNumber || !costPerNight || !capacity || !numberOfBeds || !description)
            return next(new HttpException(400, 'Fill all required gaps'))
        if (capacity > 1000) return next(new HttpException(400, 'Capacity is too big for the room'))
        if (roomNumber > 10000) return next(new HttpException(400, 'Room number is too big'))
        if (numberOfBeds > 10) return next(new HttpException(400, 'Bed number is too big'))
        try {
            const hotel = await Hotel.findByPk(hotelId)
            if (!hotel) return next(new HttpException(400, "Can't verify hotel"))
            const chceckIfRoomExists = await Room.findOne({ where: { roomNumber } })
            if (chceckIfRoomExists) return next(new HttpException(400, 'Such a room already exists'))
            const newRoom = await Room.create({
                roomNumber,
                description,
                costPerNight,
                capacity,
                numberOfBeds,
                hotelId,
            })
            res.status(200).json({ message: 'Room created succesffuly', data: newRoom })
        } catch (error) {
            next(new HttpException(500, 'An error occured'))
        }
    },
)
router.post('/specific', async (req: Request, res: Response, next: NextFunction) => {
    const { cost, capacity, numberOfBeds } = req.body

    try {
        const rooms = await Room.findAll({
            where: {
                capacity,
                costPerNight: {
                    [Op.lte]: cost,
                },
                numberOfBeds,
            },
        })
        if (rooms.length === 0) return next(new HttpException(400, "Can't find such a room"))
        return res.status(200).json(rooms)
    } catch (error) {
        next(new HttpException(500, 'An error occured'))
    }
})
export default router
