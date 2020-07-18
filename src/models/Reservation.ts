import { sequelize } from '.'
import * as Sequelize from 'sequelize'
export interface ReservationInstances extends Sequelize.Model {
    id: number
    fromData: Date
    toData: Date
    howManyDays: number
    entireCost: number
    expired: boolean
}
export const Reservation = sequelize.define<ReservationInstances>(
    'reservation',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fromData: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        toData: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        howManyDays: {
            type: Sequelize.SMALLINT,
            allowNull: false,
        },
        entireCost: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        expired: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        timestamps: false,
    },
)
