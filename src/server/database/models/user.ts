import type { ModelInitializer } from '@database/typings';
import { DataTypes, Model, Optional } from 'sequelize';

export type UserRole = 'user' | 'moderator' | 'admin';

export interface UserAttributes {
    id: number;
    telegramId: number;
    name: string;
    role: UserRole;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export default class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: number;
    declare telegramId: number;
    declare name: string;
    declare role: UserRole;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

export const init: ModelInitializer = sequelize => {
    User.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        telegramId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(128),
            defaultValue: '#user',
        },
        role: {
            type: DataTypes.ENUM('user', 'moderator', 'admin'),
            defaultValue: 'user',
        },
    }, {
        sequelize,
        tableName: 'user',
        modelName: 'user',
        freezeTableName: true,
    });
};
