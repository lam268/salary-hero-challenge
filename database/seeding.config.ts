import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

dotenv.config();
const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } = process.env;

const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    database: DB_NAME,
    port: parseInt(DB_PORT) || 5433,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    host: DB_HOST,
    seedName: 'seed',
    synchronize: false,
    migrationsRun: false,
    migrations: ['database/migrations/**/*{.ts,.js}'],
    entities: ['dist/**/*.entity{.ts,.js}'],
    seeds: ['database/seedings/**/*{.ts,.js}'],
};

export default new DataSource(options);
