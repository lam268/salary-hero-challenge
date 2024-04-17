import { INestApplication } from '@nestjs/common';
import {
    getDataSourceToken,
    getEntityManagerToken,
    getRepositoryToken,
} from '@nestjs/typeorm';
import { TABLE_NAME } from '../../database/database.constant';
import { User } from '../../src/entities/user.entity';
import { UserSalary } from '../../src/entities/userSalary.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';

export class TestRepo {
    // initialize all necessary repository here
    static dataSource: DataSource;
    static entityManager: EntityManager;
    static userRepo: Repository<User>;
    static userSalaryRepo: Repository<UserSalary>;

    static initRepo = async (app: INestApplication) => {
        this.dataSource = await app.get(getDataSourceToken());
        this.entityManager = await app.get(getEntityManagerToken());
        this.userRepo = await app.get(getRepositoryToken(User));
        this.userSalaryRepo = await app.get(getRepositoryToken(UserSalary));
    };

    static clearAllRepo = async () => {
        await this.userSalaryRepo.clear();
        await this.userRepo.clear();
    };

    static setSequenceIdOfTable = async (
        tableName: TABLE_NAME,
        currentValue: number,
    ) => {
        await this.entityManager.query(
            `ALTER SEQUENCE ${tableName}_id_seq
            RESTART WITH ${currentValue}`,
        );
    };

    static renameTable = async (oldName: string, newName: string) => {
        await this.entityManager.query(
            `ALTER TABLE ${oldName}
            RENAME TO ${newName};`,
        );
    };
}
