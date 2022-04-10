import type { ModelInitializer } from '@database/typings';
import { DataTypes, Model, Optional } from 'sequelize';

export interface RegionAttributes {
    code: string;
    country: string;
    region: string;
    city: string;
}

type RegionCreationAttributes = Optional<RegionAttributes, 'code'>;

export default class Region extends Model<RegionAttributes, RegionCreationAttributes> implements RegionAttributes {
    declare code: string;
    declare country: string;
    declare region: string;
    declare city: string;
}

export const init: ModelInitializer = sequelize => {
    Region.init({
        code: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        country: {
            type: DataTypes.STRING(32),
        },
        region: {
            type: DataTypes.STRING(64),
        },
        city: {
            type: DataTypes.STRING(32),
        }
    }, {
        sequelize,
        tableName: 'region',
        modelName: 'region',
        freezeTableName: true,
        timestamps: false,
    });
};
