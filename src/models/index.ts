import { Sequelize } from 'sequelize'
import config from '../config.json'
export const sequelize = new Sequelize(config.database, config.username, config.password, {
    dialect: 'postgres',
    port: 5432,
})
sequelize.sync({ force: true }).then(() => 'Table created')
