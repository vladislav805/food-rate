import type { UserAttributes } from '@database/models/user';
import type { RestaurantAttributes } from '@database/models/restaurant';
import type { DishAttributes, DishAttributesExtra } from '@database/models/dish';
import type { ReviewAttributes, ReviewAttributesExtra, ReviewAttributesTimestamps } from '@database/models/review';
import type { CategoryAttributes } from '@database/models/category';
import type { BranchAttributes } from '@database/models/branch';
import type { RegionAttributes } from '@database/models/region';

export type IUser = UserAttributes;
export type { UserRole } from '@database/models/user';

export type IRestaurant = RestaurantAttributes;

export type IDish = DishAttributes & DishAttributesExtra;

export type IReview = ReviewAttributes & ReviewAttributesExtra & ReviewAttributesTimestamps;

export type ICategory = CategoryAttributes;

export type IBranch = BranchAttributes;

export type IRegion = RegionAttributes;
