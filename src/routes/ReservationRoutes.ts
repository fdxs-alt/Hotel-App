import express, { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { Reservation } from '../models/Reservation'
import { Op } from 'sequelize'
import HttpException from '../utils/httpExceptions'
import moment from 'moment'

const router = express.Router()

router.post(
    '/reserve/:userId/:hotelId/:roomId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {
        const { roomId, hotelId, userId } = req.params
        const { howManyDays, entireCost, dateFrom } = req.body
        const fData = moment(dateFrom).format('YYYY-MM-DD')
        const tData = moment(dateFrom).add(howManyDays, 'days').format('YYYY-MM-DD')
        console.log(tData, fData)
        try {
            const reservation = await Reservation.findOne({
                where: {
                    roomId,
                    hotelId,
                    [Op.or]: {
                        fromData: { [Op.and]: { [Op.gte]: fData, [Op.lte]: tData } },
                        toData: { [Op.and]: { [Op.gte]: fData, [Op.lte]: tData } },
                    },
                },
            })
            if (reservation) return res.status(400).json({ message: `Room is already reserved`, reservation })
            const newReservation = await Reservation.create({
                toData: tData,
                fromData: fData,
                howManyDays,
                entireCost,
                roomId,
                hotelId,
                userId,
            })
            res.status(200).json({ message: 'Reservation created successfully', newReservation })
        } catch (error) {
            console.log(error)
            return next(new HttpException(500, 'An error occured'))
        }
    },
)
export default router

//[Op.or]: { fromData: { [Op.gte]: fData } },
//fromData: { [Op.lte]: tData },
//[Op.or]: { toData: { [Op.gte]: fData } },
