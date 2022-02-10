import type { ModelInitializer } from '@database/typings';
import { DataTypes, Model, Optional } from 'sequelize';
import type User from '@database/models/user';

interface AuthAttributes {
    id: number;
    userId: number;
    hash: string;
}

type AuthCreationAttributes = Optional<AuthAttributes, 'id'>;

export default class Auth extends Model<AuthAttributes, AuthCreationAttributes> implements AuthAttributes {
    declare id: number;
    declare userId: number;
    declare hash: string;

    declare user: User;
}

export const init: ModelInitializer = sequelize => {
    Auth.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        tableName: 'auth',
        modelName: 'auth',
        freezeTableName: true,
        timestamps: true,
    });
};
