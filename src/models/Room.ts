import { sequelize } from '.'
import * as Sequelize from 'sequelize'
import { Reservation } from './Reservation'
import { Images } from './Images'
export interface RoomInstances extends Sequelize.Model {
    id: number
    roomNumber: number
    description: string
    numberOfBeds: number
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
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
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
// Relations
Room.hasMany(Reservation, { foreignKey: 'roomId' })
Reservation.belongsTo(Room)
Room.hasMany(Images, { foreignKey: 'roomId' })
Images.belongsTo(Room)
