import express, { Request, Response, NextFunction } from 'express'
import { User } from '../models/User'
import bcrypt from 'bcryptjs'
import toAuthJWT from '../utils/toAuthJWT'
import { validateTelephoneNumber, validateEmail } from '../utils/Validation'
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'
import HttpException from '../utils/httpExceptions'
const router = express.Router()
const phoneUtil = PhoneNumberUtil.getInstance()
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, surname, isOwner, contactNumber, password, confirmPassword, iso2 } = req.body

    if (!email || !name || !surname || !contactNumber || !password || !iso2)
        return next(new HttpException(400, 'Fill all gaps'))

    if (!validateEmail(email)) return next(new HttpException(400, 'Invalid email'))

    if (password.length < 8) return next(new HttpException(400, 'Password is too short'))

    if (confirmPassword !== password) return next(new HttpException(400, 'Passwords are not identical'))

    if (!validateTelephoneNumber(contactNumber, iso2)) return next(new HttpException(400, 'Number is not valid'))
    try {
        const user = await User.findOne({ where: { email } })
        if (user) return next(new HttpException(400, 'User already exists'))
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            email,
            name,
            surname,
            isOwner,
            contactNumber: phoneUtil.format(
                phoneUtil.parseAndKeepRawInput(contactNumber, iso2),
                PhoneNumberFormat.E164,
            ),
            password: hashedPassword,
        })
        res.status(200).json({ message: 'User has been created successfully' })
    } catch (error) {
        console.log(error)
        return next(new HttpException(500, 'An error occured'))
    }
})
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    if (!email || !password) return next(new HttpException(400, 'Fill all gaps'))

    try {
        const user = await User.findOne({ where: { email } })
        if (!user) return next(new HttpException(401, 'Email or password is wrong'))
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return next(new HttpException(401, 'User unauthorized'))

        res.status(200).json({
            message: 'User was logged in successfully',
            data: toAuthJWT(user),
        })
    } catch (error) {
        console.log(error)
        return next(new HttpException(500, 'An error occured'))
    }
})
export default router
