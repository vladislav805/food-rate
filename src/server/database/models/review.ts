import type { ModelInitializer } from '@database/typings';
import type { UserAttributes } from '@database/models/user';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ReviewAttributes {
    id: number;
    userId: number;
    dishId: number;
    branchId: number | null;
    rate: number; // 1-10
    text: string;
}

export interface ReviewAttributesExtra {
    rateValue?: number;
    rateCount?: number;
    user: UserAttributes;
}

export interface ReviewAttributesTimestamps {
    createdAt: string;
    updatedAt: string;
}

type ReviewCreationAttributes = Optional<ReviewAttributes, 'id'>;

export default class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
    declare id: number;
    declare userId: number;
    declare dishId: number;
    declare branchId: number;
    declare rate: number;
    declare text: string;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    declare rateValue?: number;
    declare rateCount?: number;
}

export const init: ModelInitializer = sequelize => {
    const UNIQUE_REVIEW = 'unique_review';

    Review.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            unique: UNIQUE_REVIEW,
        },
        dishId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            unique: UNIQUE_REVIEW,
        },
        branchId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            unique: UNIQUE_REVIEW,
        },
        rate: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 10,
            },
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'review',
        modelName: 'review',
        freezeTableName: true,
    });
};
