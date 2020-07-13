import express, { Request, Response } from 'express'
import { User } from '../models/User'
import bcrypt from 'bcryptjs'
const router = express.Router()

router.post('/register', async (req: Request, res: Response) => {
    const { email, name, surname, isOwner, contactNumber, password } = req.body
    const emailValidation = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )

    if (!email || !name || !surname || !contactNumber || !password)
        return res.status(400).json({ error: 'Fill all gaps' })
    if (!emailValidation.test(email)) return res.status(400).json({ error: 'Invalid email' })

    if (password.length < 8) return res.status(400).json({ error: 'Password is too short' })
    if (contactNumber.length !== 9) return res.status(400).json({ error: 'Contact number is wrong' })

    try {
        const user = await User.findOne({ where: { email } })
        if (user) return res.status(400).json({ error: 'User already exists' })
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            email,
            name,
            surname,
            isOwner,
            contactNumber,
            password: hashedPassword,
        })
    } catch (error) {
        res.status(500).json({ error: 'An error occured' })
    }
})
export default router
