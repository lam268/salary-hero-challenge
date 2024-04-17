import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
dotenv.config();
const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } = process.env;

export default new DataSource({
    type: 'postgres',
    database: DB_NAME,
    port: parseInt(DB_PORT) || 5432,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    host: DB_HOST,
    synchronize: false,
    migrationsRun: false,
    migrations: ['database/migrations/**/*{.ts,.js}'],
});
