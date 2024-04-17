import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TABLE_NAME, commonColumns } from '../database.constant';
import { USER_SALARY_TYPE } from '../../src/modules/user-salary/userSalary.constant';

export class UserSalary1686649812900 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: TABLE_NAME.USER_SALARY,
                columns: [
                    ...commonColumns,
                    {
                        name: 'type',
                        type: 'enum',
                        enum: Object.values(USER_SALARY_TYPE),
                        isNullable: false,
                    },
                    {
                        name: 'ratePerUnit',
                        type: 'decimal',
                        precision: 13,
                        scale: 3,
                        isNullable: false,
                        default: 0,
                    },
                    {
                        name: 'lastTimeCronJobUpdated',
                        type: 'timestamptz',
                        isNullable: true,
                    },
                    {
                        name: 'userId',
                        type: 'int',
                        isNullable: false,
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(TABLE_NAME.USER_SALARY);
    }
}
