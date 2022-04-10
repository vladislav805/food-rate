import type { ModelInitializer } from '@database/typings';
import { DataTypes, Model, Optional } from 'sequelize';

export type UserRole = 'user' | 'moderator' | 'admin';

export interface UserAttributes {
    id: number;
    telegramId?: number;
    vkId?: number;
    googleId?: string;
    name: string;
    photoSmall?: string;
    photoLarge?: string;
    role: UserRole;
    regionCode?: string;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export default class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: number;
    declare telegramId?: number;
    declare vkId?: number
    declare googleId?: string;
    declare name: string;
    declare photoSmall: string;
    declare photoLarge: string;
    declare role: UserRole;
    declare regionCode?: string;

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
            allowNull: true,
            unique: true,
        },
        vkId: {
            type: DataTypes.BIGINT,
            allowNull: true,
            unique: true,
        },
        googleId: {
            type: DataTypes.STRING(32),
            allowNull: true,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(128),
            defaultValue: '#user',
        },
        photoSmall: {
            type: DataTypes.STRING(512),
            allowNull: true,
        },
        photoLarge: {
            type: DataTypes.STRING(512),
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM('user', 'moderator', 'admin'),
            defaultValue: 'user',
        },
        regionCode: {
            type: DataTypes.STRING(8),
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'user',
        modelName: 'user',
        freezeTableName: true,
    });
};
