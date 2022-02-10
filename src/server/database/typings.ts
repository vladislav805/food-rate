import type { Sequelize } from 'sequelize';

export type ModelInitializer = (sequelize: Sequelize) => void;
