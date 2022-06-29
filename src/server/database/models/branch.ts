import type { ModelInitializer } from '@database/typings.js';
import { DataTypes, Model, Optional } from 'sequelize';

export interface BranchAttributes {
    id: number;
    restaurantId: number;
    address: string;
    latitude: number;
    longitude: number;
    regionCode: string;
}

type BranchCreationAttributes = Optional<BranchAttributes, 'id'>;

export default class Branch extends Model<BranchAttributes, BranchCreationAttributes> implements BranchAttributes {
    declare id: number;
    declare restaurantId: number;
    declare address: string;
    declare latitude: number;
    declare longitude: number;
    declare regionCode: string;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

export const init: ModelInitializer = sequelize => {
    Branch.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        restaurantId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DOUBLE,
            validate: {
                min: -90,
                max: 90,
            },
        },
        longitude: {
            type: DataTypes.DOUBLE,
            validate: {
                min: -180,
                max: 180,
            },
        },
        regionCode: {
            type: DataTypes.STRING(8),
        },
    }, {
        sequelize,
        tableName: 'branch',
        modelName: 'branch',
        freezeTableName: true,
    });
};
