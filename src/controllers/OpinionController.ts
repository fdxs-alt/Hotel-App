import { Request, Response, NextFunction } from 'express'
import { Opinion } from '../models/Opinion'
import HttpException from '../utils/httpExceptions'
import moment from 'moment'

const getAllHotelOpinions = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { hotelId } = req.params
    try {
        const opinions = await Opinion.findAll({ where: { id: hotelId } })
        if (opinions.length === 0) return res.status(200).json({ message: 'There are no opinions yet, add yours!' })
        return res.status(200).json(opinions)
    } catch (error) {
        return next(new HttpException(500, 'An error occured'))
    }
}

const addOpinon = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
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
}
const deleteOpinion = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { opinionId } = req.params
    try {
        await Opinion.destroy({ where: { id: opinionId } })
        return res.status(200).json({ message: 'Opinion has been deleted succesfully' })
    } catch (error) {
        return next(new HttpException(500, 'An error occured'))
    }
}
export default { getAllHotelOpinions, addOpinon, deleteOpinion }
