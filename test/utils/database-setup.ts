import { TestConfig } from './config';
import {
    PostgreSqlContainer,
    StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

export class TestDBSetup {
    static db: StartedPostgreSqlContainer;
    static createDatabase = async () => {
        this.db = await new PostgreSqlContainer('salary-hero')
            .withExposedPorts({
                container: TestConfig.dbExposedPort,
                host: TestConfig.dbHostPort,
            })
            .withDatabase(TestConfig.dbName)
            .withUsername(TestConfig.dbUserName)
            .withPassword(TestConfig.dbPassword)
            .start();
    };
    static stopDatabase = async () => {
        await this.db.stop();
    };
}
