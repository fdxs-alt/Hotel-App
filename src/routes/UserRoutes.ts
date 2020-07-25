import express from 'express'
import passport from 'passport'
import UserController from '../controllers/UserController'
const router = express.Router()

router.post('/changePassword/:userId', passport.authenticate('jwt', { session: false }), UserController.changePassword)

router.post('/contact/:userId/:hotelId', passport.authenticate('jwt', { session: false }), UserController.createContact)

router.post(
    '/sendMessage/:conversationId',
    passport.authenticate('jwt', { session: false }),
    UserController.sendMessage,
)

router.delete(
    '/deleteConversation/:conversationId',
    passport.authenticate('jwt', { session: false }),
    UserController.deleteConversation,
)

export default router
