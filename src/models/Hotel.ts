import { sequelize } from '.'
import * as Sequelize from 'sequelize'
import { Room } from './Room'
import { Reservation } from './Reservation'
import { Images } from './Images'
import { Conversation } from './Conversation'
export interface HotelInstances extends Sequelize.Model {
    id: number
    hotelName: string
    roomNumber: number
    accountNumber: number
    city: string
    street: string
    contactNumber: number
    contactEmail: string
    stars: number
    type: string
    name: string
    data: string
}
export const Hotel = sequelize.define<HotelInstances>('hotel', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    hotelName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    roomNumber: {
        type: Sequelize.SMALLINT,
        allowNull: false,
    },
    accountNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    street: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    contactNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    contactEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    stars: {
        type: Sequelize.SMALLINT,
        allowNull: false,
    },
    type: {
        type: Sequelize.STRING,
    },
    name: {
        type: Sequelize.STRING,
    },

    data: {
        type: Sequelize.BLOB('long'),
    },
})
Hotel.hasMany(Room, {
    foreignKey: 'hotelId',
})
Room.belongsTo(Hotel)
Hotel.hasMany(Reservation, { foreignKey: 'hotelId' })
Reservation.belongsTo(Hotel)
Hotel.hasMany(Conversation, { foreignKey: 'hotelId' })
Conversation.belongsTo(Hotel)
Hotel.hasMany(Images, { foreignKey: 'hotelId' })
Images.belongsTo(Hotel)
