import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TABLE_NAME, commonColumns } from '../database.constant';
import {
    AUDIT_LOG_MODULES,
    USER_ACTION,
} from '../../src/common/common.constant';

export class AuditLog1686649813000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: TABLE_NAME.AUDIT_LOG,
                columns: [
                    ...commonColumns,
                    {
                        name: 'module',
                        type: 'enum',
                        enum: Object.values(AUDIT_LOG_MODULES),
                        isNullable: false,
                        default: `'${AUDIT_LOG_MODULES.USER}'`,
                    },
                    {
                        name: 'action',
                        type: 'enum',
                        enum: Object.values(USER_ACTION),
                        isNullable: false,
                        default: `'${USER_ACTION.POST}'`,
                    },
                    {
                        name: 'oldValue',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'newValue',
                        type: 'json',
                        isNullable: true,
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(TABLE_NAME.AUDIT_LOG);
    }
}
