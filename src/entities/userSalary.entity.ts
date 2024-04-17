import { TABLE_NAME } from '../../database/database.constant';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { USER_SALARY_TYPE } from '../modules/user-salary/userSalary.constant';
import { User } from './user.entity';

@Entity({ name: TABLE_NAME.USER_SALARY })
export class UserSalary extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: USER_SALARY_TYPE,
        nullable: true,
    })
    type: USER_SALARY_TYPE;

    @Column('decimal', {
        precision: 13,
        scale: 3,
        nullable: false,
    })
    ratePerUnit: number;

    @Column({ type: 'timestamptz', nullable: false })
    lastTimeCronJobUpdated: Date;

    @Column({ nullable: false })
    userId: number;

    @OneToOne(() => User, (user) => user.userSalary)
    @JoinColumn()
    user: User;
}
