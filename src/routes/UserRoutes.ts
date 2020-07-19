import express, { Request, Response, NextFunction } from 'express'
import { User } from '../models/User'
import { Conversation } from '../models/Conversation'
import { Hotel } from '../models/Hotel'
import { Messages } from '../models/Messages'
import passport from 'passport'
import HttpException from '../utils/httpExceptions'
import bcrypt from 'bcryptjs'
import moment from 'moment'
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
router.post(
    '/contact/:userId/:hotelId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {
        const { hotelId, userId } = req.params
        const { subject, content, issuedBy } = req.body
        if (!subject || !issuedBy || !content) return next(new HttpException(400, 'Fill all gaps'))
        try {
            const hotel = await Hotel.findByPk(hotelId)
            if (!hotel) return next(new HttpException(400, "Can't find hotel"))
            const alreadyExists = await Conversation.findOne({ where: { userId, hotelId } })
            if (alreadyExists)
                return next(new HttpException(400, 'You have already started conversation with the hotel'))
            const newConversation = await Conversation.create({
                subject,
                date: moment().format('YYYY-MM-DD'),
                userId,
                hotelId,
            })
            await Messages.create({
                content,
                issuedBy,
                conversationId: newConversation.id,
                time: moment().format('YYYY-MM-DD'),
            })
            res.status(200).json({ message: 'Message has been sent succesffuly' })
        } catch (error) {
            return next(new HttpException(500, 'An error occured'))
        }
    },
)
router.post(
    '/sendMessage/:conversationId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {
        const { conversationId } = req.params
        const { content, issuedBy } = req.body

        if (!content) return next(new HttpException(400, 'You need to specify the content of message'))
        try {
            await Messages.create({
                content,
                time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                conversationId,
                issuedBy,
            })
            return res.status(200).json({ message: 'Message has been sent successfully' })
        } catch (error) {
            return next(new HttpException(500, 'An error occured'))
        }
    },
)
export default router
