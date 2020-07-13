import { Strategy, ExtractJwt } from 'passport-jwt'
import { User } from '../models/User'
import config from '../config.json'
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret,
}
export default new Strategy(options, function (jwt, done) {
    User.findOne({ where: { id: jwt.sub } })
        .then((user) => {
            if (user) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        })
        .catch((err) => done(err, false))
})
