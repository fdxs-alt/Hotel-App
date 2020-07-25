import express from 'express'
import passport from 'passport'
import { validateIsHotelOwner } from '../utils/Validation'
import ReservationController from '../controllers/ReservationController'
const router = express.Router()

router.post(
    '/book/:userId/:hotelId/:roomId',
    passport.authenticate('jwt', { session: false }),
    ReservationController.addNewReservation,
)
router.delete(
    '/cancel/:reservationId',
    passport.authenticate('jwt', { session: false }),
    validateIsHotelOwner,
    ReservationController.cancelReservation,
)
router.get(
    '/myReservation/:userId',
    passport.authenticate('jwt', { session: false }),
    ReservationController.getAllMyReservations,
)
router.get(
    '/allReservations/:hotelId',
    passport.authenticate('jwt', { session: false }),
    validateIsHotelOwner,
    ReservationController.getAllHotelReservation,
)
export default router
