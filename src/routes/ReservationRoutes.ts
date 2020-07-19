import express, { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { Reservation } from '../models/Reservation'
import { Op } from 'sequelize'
import HttpException from '../utils/httpExceptions'
import moment from 'moment'
import { validateIsHotelOwner } from '../utils/Validation'
const router = express.Router()

router.post(
    '/book/:userId/:hotelId/:roomId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {
        const { roomId, hotelId, userId } = req.params
        const { howManyDays, entireCost, dateFrom } = req.body
        const today = moment().format('YYYY-MM-DD')
        const fData = moment(dateFrom).format('YYYY-MM-DD')
        const tData = moment(dateFrom).add(howManyDays, 'days').format('YYYY-MM-DD')
        if (tData < today || fData < today || tData < fData)
            return next(new HttpException(500, 'Given dates are not correct'))
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
router.delete(
    '/cancel/:reservationId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {
        const { reservationId } = req.params
        try {
            const dataToDelete = await Reservation.destroy({ where: { id: reservationId } })
            if (!dataToDelete) return next(new HttpException(400, "Can't find given reservation"))
            return res.status(200).json({ message: 'Reservation was canceled successfully' })
        } catch (error) {
            return next(new HttpException(500, 'An error occured'))
        }
    },
)
router.get(
    '/myReservation/:userId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params
        try {
            const myReservation = await Reservation.findAll({ where: { userId } })
            if (myReservation.length === 0) return next(new HttpException(400, "You don't have any reservation yet"))
            myReservation.forEach(async (reservation) => {
                if (reservation.toData.toString() < moment().format('YYYY-MM-DD')) reservation.expired = true
                await reservation.save()
            })
            return res.status(200).json(myReservation)
        } catch (error) {
            return next(new HttpException(500, 'An error occured'))
        }
    },
)
router.get(
    '/allReservations/:hotelId',
    passport.authenticate('jwt', { session: false }),
    validateIsHotelOwner,
    async (req: Request, res: Response, next: NextFunction) => {
        const { hotelId } = req.params
        try {
            const allReservations = await Reservation.findAll({ where: { hotelId } })
            if (allReservations.length === 0) return next(new HttpException(400, 'There are not any reservations yet'))
            allReservations.forEach(async (reservation) => {
                if (reservation.toData.toString() < moment().format('YYYY-MM-DD')) reservation.expired = true
                await reservation.save()
            })

            return res.status(200).json(allReservations)
        } catch (error) {
            return next(new HttpException(500, 'An error occured'))
        }
    },
)
export default router
