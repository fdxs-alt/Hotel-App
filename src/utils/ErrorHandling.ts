import { Request, Response, NextFunction } from 'express'
import HttpException from './httpExceptions'

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    const err = new HttpException(404, '404 page not found')
    next(err)
}
export const handleErrors = (error: HttpException, req: Request, res: Response, next: NextFunction): void => {
    res.status(error.status || 500).json({ error: error.message })
    next()
}
