import { sequelize } from '.'
import * as Sequelize from 'sequelize'
import { Messages } from './Messages'
import moment from 'moment'
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
            defaultValue: moment().format('YYYY-MM-DD'),
        },
    },
    {
        timestamps: false,
    },
)
Conversation.hasMany(Messages, { foreignKey: 'conversationId' })
Messages.belongsTo(Conversation)
