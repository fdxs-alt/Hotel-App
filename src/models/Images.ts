import * as Sequelize from 'sequelize'
import { sequelize } from '.'
export const Images = sequelize.define(
    'images',
    {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        image: {
            type: Sequelize.BLOB('long'),
        },
    },
    {
        timestamps: false,
    },
)
