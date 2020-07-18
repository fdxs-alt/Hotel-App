import express, { Request, Response, NextFunction } from 'express'
import { User } from '../models/User'
import passport from 'passport'

const router = express.Router()

router.post(
    '/changePassword/:userId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response, next: NextFunction) => {},
)
export default router
