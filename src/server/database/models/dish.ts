import type { ModelInitializer } from '@database/typings.js';
import { DataTypes, Model, Optional } from 'sequelize';
import Category, { CategoryAttributes } from '@database/models/category.js';

export interface DishAttributes {
    id: number;
    restaurantId: number;
    categoryId: number | null;
    title: string;
    description?: string;
}

export interface DishAttributesExtra {
    rateValue?: number;
    rateCount?: number;
    rateMine?: number;
    category?: CategoryAttributes;
}

type DishCreationAttributes = Optional<DishAttributes, 'id'>;

export default class Dish extends Model<DishAttributes, DishCreationAttributes> implements DishAttributes {
    declare id: number;
    declare restaurantId: number;
    declare categoryId: number;
    declare title: string;
    declare description?: string;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    // Runtime attributes
    declare rateValue?: number | null;
    declare rateCount?: number | null;
    declare rateMine?: number;
    declare category?: Category;
}

export const init: ModelInitializer = sequelize => {
    Dish.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        restaurantId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        categoryId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(4096),
            defaultValue: '',
        },
    }, {
        sequelize,
        tableName: 'dish',
        modelName: 'dish',
        freezeTableName: true,
    });
};
