import * as Sequelize from 'sequelize'
import { sequelize } from '.'
export interface ImagesInstances extends Sequelize.Model {
    id: number
    type: string
    name:string
    data:string
}
export const Images = sequelize.define<ImagesInstances>(
    'images',
    {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER,
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
    },
    {
        timestamps: false,
    },
)
