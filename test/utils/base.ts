import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { TestDBSetup } from './database-setup';
import { TestRepo } from './repo';
import { TestRequest } from './request';
import { TestMigration } from './migration';

export class TestBase {
    static app: INestApplication;
    static configService = new ConfigService();
    static schedulerRegistry = new SchedulerRegistry();
    static init = async () => {
        console.log('Booting test container');
        await TestDBSetup.createDatabase();
        console.log('Running migration');
        await TestMigration.runMigration();
        console.log('Booting test application');
        this.app = await this.initApp();
        console.log('Initializing repository');
        await TestRepo.initRepo(this.app);
        console.log('Initializing Request');
        await TestRequest.init(this.app);
        console.log('Finished setting up test environment');
    };

    static initApp = async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        const app = moduleFixture.createNestApplication();
        await app.init();
        return app;
    };

    static close = async () => {
        console.log('Tearing down test environment');
        // await TestRepo.clearAllRepo();
        jest.clearAllMocks();
        await this.app.close();
        await TestDBSetup.stopDatabase();
        console.log('Test environment teared down');
    };
}
