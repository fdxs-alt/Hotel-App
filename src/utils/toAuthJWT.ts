import { UserInstances } from '../models/User'
import jwt from 'jsonwebtoken'
import config from '../config.json'
interface ToReturnJWt {
    id: number
    email: string
    name: string
    surname: string
    isOwner: boolean
    confirmed: boolean
    contactNumber: number
    token: string
}
export default (user: UserInstances): ToReturnJWt => {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        isOwner: user.isOwner,
        confirmed: user.confirmed,
        contactNumber: user.contactNumber,
        token: 'Bearer ' + jwt.sign({ sub: user.id }, config.secret, { expiresIn: '12h' }),
    }
}
