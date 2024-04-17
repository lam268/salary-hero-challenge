import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TABLE_NAME } from '../../database/database.constant';
import { USER_ACTION, AUDIT_LOG_MODULES } from '../common/common.constant';

@Entity({ name: TABLE_NAME.AUDIT_LOG })
export class AuditLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: AUDIT_LOG_MODULES,
        nullable: false,
    })
    module: AUDIT_LOG_MODULES;

    @Column({
        type: 'enum',
        enum: USER_ACTION,
        nullable: false,
        default: USER_ACTION.POST,
    })
    action: USER_ACTION;

    @Column({ type: 'json', nullable: true })
    oldValue: JSON;

    @Column({ type: 'json', nullable: true })
    newValue: JSON;
}
