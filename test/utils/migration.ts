import { DataSource } from 'typeorm';
import { TestConfig } from './config';

const datasource = new DataSource({
    type: 'postgres',
    database: TestConfig.dbName,
    port: TestConfig.dbHostPort,
    username: TestConfig.dbUserName,
    password: TestConfig.dbPassword,
    host: 'localhost',
    synchronize: false,
    migrationsRun: false,
    entities: ['src/**/*.entity{.ts,.js}'],
    migrations: ['database/migrations/**/*{.ts,.js}'],
});

datasource.initialize();
export default datasource;

export class TestMigration {
    static runMigration() {
        (async () => {
            await datasource.runMigrations({
                transaction: 'none',
            });
        })();
    }
}
