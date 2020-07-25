import express from 'express'
import passport from 'passport'
import OpinionController from '../controllers/OpinionController'
const router = express.Router()

router.get('/hotelOpinions/:hotelId', OpinionController.getAllHotelOpinions)

router.post(
    '/addOpinion/:userId/:hotelId',
    passport.authenticate('jwt', { session: false }),
    OpinionController.addOpinon,
)
router.delete(
    '/deleteOpinion/:opinionId',
    passport.authenticate('jwt', { session: false }),
    OpinionController.deleteOpinion,
)
export default router
