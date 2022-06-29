import type { ModelInitializer } from '@database/typings.js';
import { DataTypes, Model, Optional } from 'sequelize';

export interface CategoryAttributes {
    id: number;
    title: string;
}

type CategoryCreationAttributes = Optional<CategoryAttributes, 'id'>;

export default class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
    declare id: number;
    declare title: string;
}

export const init: ModelInitializer = sequelize => {
    Category.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'category',
        modelName: 'category',
        freezeTableName: true,
        timestamps: false,
    });
};
