import { sequelize } from '.'
import * as Sequelize from 'sequelize'

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
        },
        howManyDays: {
            type: Sequelize.SMALLINT,
        },
        costPerNight: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        capacity: {
            type: Sequelize.SMALLINT,
            allowNull: false,
        },
        isReserved: {
            type: Sequelize.BOOLEAN,
        },
        dateOfReservation: {
            type: Sequelize.DATE,
        },
        dateOfReservationExpiration: {
            type: Sequelize.DATE,
        },
    },
    {
        timestamps: false,
    },
)
