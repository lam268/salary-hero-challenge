import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import * as dotenv from 'dotenv';
import { createWinstonLogger } from '../../../common/services/winston.service';
import {
    AUDIT_LOG_MODULES,
    TIMEZONE_NAME_DEFAULT,
    USER_ACTION,
} from '../../../common/common.constant';
import { DataSource } from 'typeorm';
import { User } from '../../../entities/user.entity';
import { userSelectAttributes } from '../../../modules/user/user.constant';
import {
    USER_SALARY_TYPE,
    userSalarySelectAttributes,
} from '../userSalary.constant';
import { UserSalary } from '../../../entities/userSalary.entity';
import { AuditLog } from '../../../entities/auditLog.entity';
import dayjs from 'dayjs';

dotenv.config();

const CRON_JOB_UPDATE_USER_BALANCE =
    process.env.CRON_JOB_UPDATE_USER_BALANCE || '1 0 * * *';

@Injectable()
export class SendUpdateUserBalanceJob {
    constructor(
        private readonly configService: ConfigService,
        private readonly dataSource: DataSource,
    ) {
        // eslint-disable-next-line prettier/prettier
    }
    private readonly logger = createWinstonLogger(
        `user-salary-update-user-balance`,
    );

    get userRepo() {
        return this.dataSource.getRepository(User);
    }

    get userSalaryRepo() {
        return this.dataSource.getRepository(UserSalary);
    }

    @Cron(CRON_JOB_UPDATE_USER_BALANCE, {
        timeZone: TIMEZONE_NAME_DEFAULT,
    })
    async updateUserBalance() {
        this.logger.info('[UpdateBalance] Start cronjob');
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const timeNow = Date.now();
            const users = await this.userRepo
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.userSalary', 'userSalary')
                .select([
                    ...userSelectAttributes,
                    ...userSalarySelectAttributes,
                ])
                .where((queryBuilder) => {
                    queryBuilder.andWhere(
                        `userSalary.lastTimeCronJobUpdated is null`,
                    );
                    queryBuilder.orWhere(
                        `userSalary.lastTimeCronJobUpdated is null`,
                    );
                })
                .getMany();
            const updateUsers = [];
            const updateUserSalaries = [];
            users.forEach((user) => {
                let balance = user.balance;
                const userSalary = user.userSalary;
                const dayInMonth = Number(dayjs(timeNow).daysInMonth());
                if (userSalary) {
                    const ratePerUnit = userSalary.ratePerUnit;
                    const salaryType = userSalary.type;
                    if (ratePerUnit > 0) {
                        balance +=
                            salaryType === USER_SALARY_TYPE.DAILY
                                ? ratePerUnit
                                : Number((ratePerUnit / dayInMonth).toFixed(3));
                    }
                    updateUsers.push({
                        id: user.id,
                        fullName: user.fullName,
                        email: user.email,
                        balance,
                    });
                    updateUserSalaries.push({
                        id: userSalary.id,
                        type: userSalary.type,
                        ratePerUnit: userSalary.ratePerUnit,
                        userId: user.id,
                        lastTimeCronJobUpdated: timeNow,
                    });
                }
            });
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({ ...updateUsers })
                .execute();
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(UserSalary)
                .values({ ...updateUserSalaries })
                .execute();
            const logginData = {
                action: USER_ACTION.CRON_JOB,
                module: AUDIT_LOG_MODULES.USER,
                oldValue: {
                    ...users,
                },
                newValue: {
                    ...updateUsers,
                },
                createdAt: new Date(),
                createdBy: 1,
            } as unknown as AuditLog;
            await queryRunner.manager.getRepository(AuditLog).save({
                ...logginData,
            });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(
                '[UpdateBalance] Error in updateUserBalance: ',
                error,
            );
        } finally {
            await queryRunner.commitTransaction();
            this.logger.info('[UpdateBalance] End cronjob !');
        }
    }
}
