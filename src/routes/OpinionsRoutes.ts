import express, { Request, Response, NextFunction } from 'express'
import { Opinion } from '../models/Opinion'
import HttpException from '../utils/httpExceptions'
import passport from 'passport'
import moment from 'moment'
const router = express.Router()

router.get('/hotelOpinions/:hotelId', async (req: Request, res: Response, next: NextFunction) => {
    const { hotelId } = req.params
    try {
        const opinions = await Opinion.findAll({ where: { id: hotelId } })
        if (opinions.length === 0) return res.status(200).json({ message: 'There are no opinions yet, add yours!' })
        return res.status(200).json(opinions)
    } catch (error) {
        return next(new HttpException(500, 'An error occured'))
    }
})
router.post(
    '/addOpinion/:userId/:hotelId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {
        const { userId, hotelId } = req.params
        const { title, content, mark } = req.body
        if (!title || !content || !mark) return next(new HttpException(400, 'Fill all gaps'))
        if (mark > 5 || mark < 0) return next(new HttpException(400, 'Pass proper mark'))
        try {
            const newOpinion = await Opinion.create({
                title,
                content,
                mark,
                date: moment().format('YYYY-MM-DD'),
                userId,
                hotelId,
            })
            return res.status(200).json({ message: 'Opinion added successfully', newOpinion })
        } catch (error) {
            return next(new HttpException(500, 'An error occured'))
        }
    },
)
export default router
