import { sequelize } from '.'
import * as Sequelize from 'sequelize'
import { Reservation } from './Reservation'
export interface RoomInstances extends Sequelize.Model {
    id: number
    roomNumber: number
    isReserved: boolean
    howManyDays: number
    dateOfReservation: Date
    dateOfReservationExpiration: Date
    costPerNight: number
    capacity: number
}
export const Room = sequelize.define<RoomInstances>(
    'room',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        roomNumber: {
            type: Sequelize.SMALLINT,
            allowNull: false,
            unique: true,
        },
        costPerNight: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        capacity: {
            type: Sequelize.SMALLINT,
            allowNull: false,
        },
        numberOfBeds: {
            type: Sequelize.SMALLINT,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    },
)
Room.hasMany(Reservation, { foreignKey: 'roomId' })
Reservation.belongsTo(Room)
