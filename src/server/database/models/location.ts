import type { ModelInitializer } from '@database/typings';
import { DataTypes, Model, Optional } from 'sequelize';

export interface LocationAttributes {
    id: number;
    title: string;
}

type LocationCreationAttributes = Optional<LocationAttributes, 'id'>;

export default class Location extends Model<LocationAttributes, LocationCreationAttributes> implements LocationAttributes {
    declare id: number;
    declare title: string;
}

export const init: ModelInitializer = sequelize => {
    Location.init({
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
        tableName: 'location',
        modelName: 'location',
        freezeTableName: true,
        timestamps: false,
    });
};
