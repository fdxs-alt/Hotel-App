import express from 'express'
import { validateIsHotelOwner } from '../utils/Validation'
import passport from 'passport'
import RoomController from '../controllers/RoomControler'

const router = express.Router()

router.get('/', RoomController.getAllRooms)

router.get('/:roomId', RoomController.getRoomById)

router.post(
    '/create/:hotelId',
    passport.authenticate('jwt', { session: false }),
    validateIsHotelOwner,
    RoomController.addRoom,
)
router.post(
    '/upload/:hotelId/:roomId',
    passport.authenticate('jwt', { session: false }),
    validateIsHotelOwner,
    RoomController.uploadPhotos,
)

router.get('/allPhotos/:hotelId/:roomId', RoomController.getAllPhotos)

router.post('/specific', RoomController.specificRoom)

export default router
