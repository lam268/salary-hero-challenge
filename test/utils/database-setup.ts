import { TestConfig } from './config';
import {
    PostgreSqlContainer,
    StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

export class TestDBSetup {
    static db: StartedPostgreSqlContainer;
    static createDatabase = async () => {
        try {
            this.db = await new PostgreSqlContainer('postgres')
                .withExposedPorts({
                    container: TestConfig.dbExposedPort,
                    host: TestConfig.dbHostPort,
                })
                .withDatabase(TestConfig.dbName)
                .withUsername(TestConfig.dbUserName)
                .withPassword(TestConfig.dbPassword)
                .start();
        } catch (error) {
            console.log('Error in database setup', error);
        }
    };
    static stopDatabase = async () => {
        await this.db.stop();
    };
}
