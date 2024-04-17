import { TableColumnOptions } from 'typeorm';

export enum TABLE_NAME {
    AUDIT_LOG = 'audit_log',
    USER = 'user',
    USER_SALARY = 'user_salary',
}

export const commonColumns: TableColumnOptions[] = [
    {
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
    },
    {
        name: 'createdAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
    },
    {
        name: 'updatedAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        isNullable: true,
    },
    {
        name: 'deletedAt',
        type: 'timestamp',
        isNullable: true,
    },
    {
        name: 'createdBy',
        type: 'int',
        isNullable: true,
    },
    {
        name: 'updatedBy',
        type: 'int',
        isNullable: true,
    },
    {
        name: 'deletedBy',
        type: 'int',
        isNullable: true,
    },
];
