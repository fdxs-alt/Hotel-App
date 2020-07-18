import { sequelize } from '.'
import * as Sequelize from 'sequelize'
export interface MessagesInstance extends Sequelize.Model {
    id: number
    content: string
    issuedBy: string
    time: Date
}
export const Messages = sequelize.define<MessagesInstance>(
    'messages',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        issuedBy: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        time: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
    },
    { timestamps: false },
)
