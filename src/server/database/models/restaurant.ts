import type { ModelInitializer } from '@database/typings.js';
import { DataTypes, Model, Optional } from 'sequelize';

/**
 * place - офлайновое место, которое можно посетить
 * delivery - доставка
 * mixed - место и доставка
 */
export type RestaurantType = 'place' | 'delivery' | 'mixed';

export interface RestaurantAttributes {
    id: number;
    title: string;
    description?: string;
    type: RestaurantType;
    instagram?: string;
    vk?: string;
}

type RestaurantCreationAttributes = Optional<RestaurantAttributes, 'id'>;

export default class Restaurant extends Model<RestaurantAttributes, RestaurantCreationAttributes> implements RestaurantAttributes {
    declare id: number;
    declare title: string;
    declare type: RestaurantType;
    declare description?: string;
    declare instagram?: string;
    declare vk?: string;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

export const init: ModelInitializer = sequelize => {
    Restaurant.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM<RestaurantType>('place', 'delivery', 'mixed'),
            defaultValue: 'place',
        },
        description: {
            type: DataTypes.STRING(1024),
            defaultValue: '',
        },
        instagram: {
            type: DataTypes.STRING(32),
            defaultValue: '',
        },
        vk: {
            type: DataTypes.STRING(32),
            defaultValue: '',
        },
    }, {
        sequelize,
        tableName: 'restaurant',
        modelName: 'restaurant',
        freezeTableName: true,
    });
};
