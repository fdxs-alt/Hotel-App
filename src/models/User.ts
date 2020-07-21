import { sequelize } from '.'
import * as Sequelize from 'sequelize'
import { Hotel } from './Hotel'
import { Reservation } from './Reservation'
import { Conversation } from './Conversation'
import { Opinion } from './Opinion'

export interface UserInstances extends Sequelize.Model {
    id: number
    email: string
    name: string
    surname: string
    isOwner: boolean
    confirmed: boolean
    contactNumber: number
    password: string
}
export const User = sequelize.define<UserInstances>('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    surname: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isOwner: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    confirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    contactNumber: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
})
User.hasMany(Hotel, {
    foreignKey: 'userId',
})
Hotel.belongsTo(User)
User.hasMany(Reservation, { foreignKey: 'userId' })
Reservation.belongsTo(User)
User.hasMany(Conversation, { foreignKey: 'userId' })
Conversation.belongsTo(User)
User.hasMany(Opinion, { foreignKey: 'userId' })
Opinion.belongsTo(User)
