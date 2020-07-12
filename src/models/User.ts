import { sequelize } from '.';
import * as Sequelize from 'sequelize';
import { Hotel } from './Hotel';
interface UserInstances extends Sequelize.Model {
    id: number;
    email: string;
    name: string;
    surname: string;
    isOwner: boolean;
    confirmed: boolean;
    contactNumber: number;
    password: string;
}
export const User = sequelize.define<UserInstances>('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    surname: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isOwner: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    confirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    contactNumber: {
        type: Sequelize.SMALLINT,
        unique: true,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});
