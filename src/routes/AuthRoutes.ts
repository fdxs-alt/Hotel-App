import express, { Request, Response } from 'express'
import { User } from '../models/User'
import bcrypt from 'bcryptjs'
import toAuthJWT from '../utils/toAuthJWT'
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'
const router = express.Router()
const phoneUtil = PhoneNumberUtil.getInstance()
router.post('/register', async (req: Request, res: Response) => {
    const { email, name, surname, isOwner, contactNumber, password, confirmPassword, iso2 } = req.body
    const emailValidation = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )

    if (!email || !name || !surname || !contactNumber || !password || !iso2)
        return res.status(400).json({ error: 'Fill all gaps' })

    const number = phoneUtil.parseAndKeepRawInput(contactNumber, iso2)

    if (!emailValidation.test(email)) return res.status(400).json({ error: 'Invalid email' })

    if (password.length < 8) return res.status(400).json({ error: 'Password is too short' })

    if (confirmPassword !== password) return res.status(400).json({ error: 'Passwords are not identical' })

    if (!phoneUtil.isPossibleNumber(number) || !phoneUtil.isValidNumber(number))
        return res.status(400).json({ error: 'Phone number is not valid' })

    try {
        const user = await User.findOne({ where: { email } })
        if (user) return res.status(400).json({ error: 'User already exists' })
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            email,
            name,
            surname,
            isOwner,
            contactNumber: phoneUtil.format(number, PhoneNumberFormat.E164),
            password: hashedPassword,
        })
        res.status(200).json({ message: 'User has been created successfully' })
    } catch (error) {
        res.status(500).json({ error: 'An error occured' })
    }
})
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Fill all gaps' })

    try {
        const user = await User.findOne({ where: { email } })
        if (!user) return res.status(401).json({ error: 'Email or password is wrong' })
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(401).json({ error: 'User unauthorized' })

        res.status(200).json({
            message: 'User was logged in successfully',
            data: toAuthJWT(user),
        })
    } catch (error) {
        res.status(500).json({ error: 'An error occured' })
    }
})
export default router
