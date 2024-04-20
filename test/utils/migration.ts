import { DataSource } from 'typeorm';
import { TestConfig } from './config';

const datasource = new DataSource({
    type: 'postgres',
    database: TestConfig.dbName,
    port: TestConfig.dbHostPort,
    username: TestConfig.dbUserName,
    password: TestConfig.dbPassword,
    host: '0.0.0.0',
    synchronize: false,
    migrationsRun: false,
    entities: ['src/**/*.entity{.ts,.js}'],
    migrations: ['database/migrations/**/*{.ts,.js}'],
});
datasource.initialize();

export class TestMigration {
    static async runMigration() {
        try {
            console.log('Start migration');
            await datasource.runMigrations({
                transaction: 'none',
            });
            console.log('Finished migration');
            await datasource.destroy();
        } catch (error) {
            console.log('Error during migration', error);
        }
    }
}
