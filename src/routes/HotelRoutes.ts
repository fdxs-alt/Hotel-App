import express, { Request, Response, NextFunction } from 'express'
import { Hotel } from '../models/Hotel'
import { User } from '../models/User'
import HttpException from '../utils/httpExceptions'
import passport from 'passport'
import { validateEmail, validateTelephoneNumber, validateAccountNumber } from '../utils/Validation'
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'
import { Op } from 'sequelize'
const router = express.Router()
const phoneUtil = PhoneNumberUtil.getInstance()
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allHotels = await Hotel.findAll()
        res.status(200).json(allHotels)
    } catch (error) {
        return next(new HttpException(500, 'An error occured'))
    }
})
router.get('/:hotelName', async (req: Request, res: Response, next: NextFunction) => {
    const { hotelName } = req.params
    try {
        const specificHotel = await Hotel.findOne({ where: { hotelName } })
        if (!specificHotel) return next(new HttpException(400, "Hotel, which you are looking for, wasn't found"))
        res.status(200).json(specificHotel)
    } catch (error) {
        return next(new HttpException(500, 'An error occured'))
    }
})
router.post(
    '/create/:userId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params
        const {
            hotelName,
            roomNumber,
            accountNumber,
            city,
            street,
            contactNumber,
            contactEmail,
            stars,
            iso2,
        } = req.body
        if (
            !hotelName ||
            !roomNumber ||
            !accountNumber ||
            !city ||
            !street ||
            !contactNumber ||
            !contactEmail ||
            !stars ||
            !iso2
        )
            return next(new HttpException(400, 'Fill all gaps'))
        if (!validateEmail(contactEmail)) return next(new HttpException(400, 'Invalid email'))
        if (!validateAccountNumber(accountNumber)) return next(new HttpException(400, 'Invalid account number'))
        if (!validateTelephoneNumber(contactNumber, iso2)) return next(new HttpException(400, 'Invalid contact number'))
        if (hotelName.length > 100 || hotelName.length < 3) return next(new HttpException(400, 'Invalid hotel name'))
        if (roomNumber > 1000 || roomNumber < 10) return next(new HttpException(400, 'Invalid room number'))
        if (stars < 0 || stars > 5) return next(new HttpException(400, 'Invalid stars number'))
        try {
            const user = await User.findByPk(userId)
            if (!user) return next(new HttpException(400, "Can't verify user"))
            const validateHotel = await Hotel.findAll({
                where: { [Op.or]: [{ hotelName }, { accountNumber }, { contactEmail }, { contactNumber }] },
            })
            if (validateHotel) return next(new HttpException(400, 'Hotel with given cridentials already exists'))
            console.log(validateHotel)
            const newHotel = await Hotel.create({
                hotelName,
                roomNumber,
                accountNumber,
                city,
                street,
                contactNumber: phoneUtil.format(
                    phoneUtil.parseAndKeepRawInput(contactNumber, iso2),
                    PhoneNumberFormat.E164,
                ),
                contactEmail,
                stars,
                userId,
            })
            return res.status(200).json({ message: 'Hotel created succussfully', data: newHotel })
        } catch (error) {
            console.log(error)
            return next(new HttpException(500, 'Something went wrong'))
        }
    },
)

export default router
