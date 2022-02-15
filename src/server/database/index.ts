import 'dotenv/config';
import { Sequelize } from 'sequelize';
import * as mysql2 from 'mysql2';

import type { ModelInitializer } from './typings';
import User, { init as initUser } from './models/user';
import Auth, { init as initAuth } from './models/auth';
import Restaurant, { init as initRestaurant } from './models/restaurant';
import Dish, { init as initDish } from './models/dish';
import Review, { init as initReview } from './models/review';
import Category, { init as initCategory } from '@database/models/category';
import Branch, { init as initBranch } from '@database/models/branch';
import config from '%config';

const sequelize = new Sequelize(config.DATABASE_URI as string, {
    dialect: 'mariadb',
    dialectModule: mysql2,
});

const models: ModelInitializer[] = [
    initUser,
    initAuth,
    initRestaurant,
    initDish,
    initReview,
    initCategory,
    initBranch,
];

models.forEach(initer => initer(sequelize));

/*
 *        +------ Branch ------+
 *        |                    |
 *        v                    v
 * Restaurant <--> Dish <--> Review <--> User <--> Auth
 *                  ^
 *                  |
 *               Category
 */

Restaurant.hasMany(Dish, {
    foreignKey: 'restaurantId',
});
Dish.belongsTo(Restaurant, {
    as: 'restaurant',
});

User.hasMany(Review, {
    foreignKey: 'userId',
});
Review.belongsTo(User, {
    as: 'user',
});

Dish.hasMany(Review, {
    foreignKey: 'dishId',
});
Review.belongsTo(Dish, {
    as: 'dish',
});

Branch.hasOne(Review, {
    foreignKey: 'branchId',
});
Review.belongsTo(Branch, {
    as: 'branch',
});

Category.hasMany(Dish, {
    foreignKey: 'categoryId',
    as: 'dish',
});
Dish.belongsTo(Category, {
    as: 'category',
});

User.hasMany(Auth, {
    foreignKey: 'userId',
});
Auth.belongsTo(User, {
    as: 'user',
});

Restaurant.hasMany(Branch, {
    foreignKey: 'restaurantId',
});
Branch.belongsTo(Restaurant, {
    as: 'restaurant',
});

sequelize.sync({});

export default sequelize;
