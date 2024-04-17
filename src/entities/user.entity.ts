import { TABLE_NAME } from '../../database/database.constant';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserSalary } from './userSalary.entity';

@Entity({ name: TABLE_NAME.USER })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    fullName: string;

    @Column({ nullable: false })
    email: string;

    @Column('decimal', {
        precision: 13,
        scale: 3,
        nullable: false,
    })
    balance: number;

    @OneToOne(() => UserSalary, (userSalary) => userSalary.user)
    userSalary: UserSalary;
}
