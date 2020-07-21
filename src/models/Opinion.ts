import * as Sequelize from 'sequelize'
import { sequelize } from '.'

export interface OpinionInstance extends Sequelize.Model {
    id: number
    title: string
    content: string
    mark: number
    date: Date
}
export const Opinion = sequelize.define<OpinionInstance>(
    'Opinion',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        mark: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
    },
    { timestamps: false },
)
