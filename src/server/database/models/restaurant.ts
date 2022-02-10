import type { ModelInitializer } from '@database/typings';
import { DataTypes, Model, Optional } from 'sequelize';

export interface RestaurantAttributes {
    id: number;
    title: string;
    description?: string;
}

type RestaurantCreationAttributes = Optional<RestaurantAttributes, 'id'>;

export default class Restaurant extends Model<RestaurantAttributes, RestaurantCreationAttributes> implements RestaurantAttributes {
    declare id: number;
    declare title: string;

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
        description: {
            type: DataTypes.STRING(1024),
            defaultValue: '',
        },
    }, {
        sequelize,
        tableName: 'restaurant',
        modelName: 'restaurant',
        freezeTableName: true,
    });
};
