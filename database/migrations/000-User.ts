import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TABLE_NAME, commonColumns } from '../database.constant';

export class User1686649812856 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: TABLE_NAME.USER,
                columns: [
                    ...commonColumns,
                    {
                        name: 'fullName',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'balance',
                        type: 'decimal',
                        precision: 13,
                        scale: 3,
                        default: 0,
                        isNullable: true,
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(TABLE_NAME.USER);
    }
}
