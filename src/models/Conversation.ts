import { sequelize } from '.'
import * as Sequelize from 'sequelize'
import { Messages } from './Messages'
export interface ConversationInstances extends Sequelize.Model {
    id: number
    subject: string
    date: Date
}
export const Conversation = sequelize.define<ConversationInstances>(
    'conversation',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        subject: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    },
)
// Relations
Conversation.hasMany(Messages, { foreignKey: 'conversationId' })
Messages.belongsTo(Conversation)
