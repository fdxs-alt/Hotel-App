import { sequelize } from '.'
import * as Sequelize from 'sequelize'
import { Room } from './Room'
interface HotelInstances extends Sequelize.Model {
    id: number
    hotelName: string
    roomNumber: number
    accountNumber: number
    city: string
    street: string
    contactNumber: number
    contactEmail: string
    stars: number
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
        type: Sequelize.SMALLINT,
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
        type: Sequelize.SMALLINT,
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
})
Hotel.hasMany(Room, {
    foreignKey: 'hotelId',
})
Room.belongsTo(Hotel)
