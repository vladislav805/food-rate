import 'dotenv/config';
import { Sequelize } from 'sequelize';
import * as mysql2 from 'mysql2';

import type { ModelInitializer } from './typings';
import User, { init as initUser } from './models/user';
import Auth, { init as initAuth } from './models/auth';
import Restaurant, { init as initRestaurant } from './models/restaurant';
import Dish, { init as initDish } from './models/dish';
import Review, { init as initReview } from './models/review';
import Category, { init as initCategory } from './models/category';
import Branch, { init as initBranch } from './models/branch';
import Region, { init as initLocation } from './models/region';
import config from '%config';

const sequelize = new Sequelize(config.DATABASE_URI, {
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
    initLocation,
];

models.forEach(initer => initer(sequelize));

/*
 *                  +------ Location ------+
 *                  |                      |
 *                  v                      |
 *        +------ Branch - - - +           |
 *        |                    |           |
 *        |      Category      |           |
 *        |         |          |           |
 *        v         v          v           v
 * Restaurant <--> Dish <--> Review <--> User <--> Auth
 *                  ^           ^
 *                  |           |
 *                  +-- Photo --+
 */

Restaurant.hasMany(Dish, {
    foreignKey: 'restaurantId',
    onDelete: 'restrict',
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
    onDelete: 'restrict',
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
    onDelete: 'restrict',
});
Branch.belongsTo(Restaurant, {
    as: 'restaurant',
});

Region.hasMany(User, {
    foreignKey: 'regionCode',
});
User.belongsTo(Region, {
    as: 'region',
});

Region.hasMany(Branch, {
    foreignKey: 'regionId',
    onDelete: 'restrict',
});

Branch.belongsTo(Region, {
    as: 'region',
});

sequelize.sync({ });

export default sequelize;
