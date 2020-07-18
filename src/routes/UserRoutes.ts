import express, { Request, Response, NextFunction } from 'express'
import { User } from '../models/User'
import passport from 'passport'
import HttpException from '../utils/httpExceptions'
import bcrypt from 'bcryptjs'
const router = express.Router()

router.post(
    '/changePassword/:userId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {
        const { password, confirmPassword } = req.body
        const { userId } = req.params
        if (!password || !confirmPassword) return next(new HttpException(404, 'Fill both gaps'))
        if (password.length < 8) return next(new HttpException(404, 'Password is too short'))
        if (password !== confirmPassword) return next(new HttpException(404, 'Passwords are not identical'))
        try {
            const user = await User.findByPk(userId)
            if (!user) return next(new HttpException(404, "Can't verfiy user"))
            user.password = await bcrypt.hash(password, 10)
            await user.save()
            return res.status(200).json({ message: 'Password has been changed successfully' })
        } catch (error) {
            return next(new HttpException(400, 'An error occured'))
        }
    },
)
export default router
