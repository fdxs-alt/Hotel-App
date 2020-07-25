import express from 'express'
import HotelController from '../controllers/HotelController'
import passport from 'passport'
import { validateIsHotelOwner } from '../utils/Validation'
const router = express.Router()

router.get('/', HotelController.getAllHotels)

router.get('/:hotelName', HotelController.getHotel)

router.post(
    '/create/:userId',
    passport.authenticate('jwt', { session: false }),
    validateIsHotelOwner,
    HotelController.createHotel,
)
router.get('/allPhotos/:hotelId', HotelController.getAllPhotos)

router.post(
    '/upload/:hotelId',
    passport.authenticate('jwt', { session: false }),
    validateIsHotelOwner,
    HotelController.addPhotos,
)

router.delete(
    '/deleteImage/:imageId',
    passport.authenticate('jwt', { session: false }),
    validateIsHotelOwner,
    HotelController.deletePhoto,
)

export default router
