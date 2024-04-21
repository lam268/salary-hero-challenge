import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import {
    AUDIT_LOG_MODULES,
    DATE_TIME_FORMAT,
    TIMEZONE_NAME_DEFAULT,
    USER_ACTION,
} from '../../../common/common.constant';
import { createWinstonLogger } from '../../../common/services/winston.service';
import { AuditLog } from '../../../entities/auditLog.entity';
import { User } from '../../../entities/user.entity';
import { UserSalary } from '../../../entities/userSalary.entity';
import { userSelectAttributes } from '../../../modules/user/user.constant';
import {
    USER_SALARY_TYPE,
    userSalarySelectAttributes,
} from '../userSalary.constant';

dotenv.config();

const CRON_JOB_UPDATE_USER_BALANCE =
    process.env.CRON_JOB_UPDATE_USER_BALANCE || '1 0 * * *';

@Injectable()
export class SendUpdateUserBalanceJob {
    constructor(private readonly dataSource: DataSource) {
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
            const timeNow = dayjs();
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
                        `DATE(userSalary.lastTimeCronJobUpdated) < :today`,
                        {
                            today: dayjs().format(
                                DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN,
                            ),
                        },
                    );
                })
                .getMany();
            const updateUsers = [];
            const updateUserSalaries = [];
            users.forEach((user) => {
                let balance = Number(user.balance);
                const userSalary = user.userSalary;
                const dayInMonth = Number(timeNow.daysInMonth());
                const days = Math.abs(
                    dayjs().diff(
                        dayjs(userSalary.lastTimeCronJobUpdated),
                        'days',
                    ),
                );
                if (userSalary) {
                    const ratePerUnit = userSalary.ratePerUnit;
                    const salaryType = userSalary.type;
                    // Case: Given monthly payments, the user must work daily throughout the month.
                    if (ratePerUnit > 0) {
                        balance +=
                            (salaryType === USER_SALARY_TYPE.DAILY
                                ? Number(ratePerUnit)
                                : Number(
                                      (ratePerUnit / dayInMonth).toFixed(3),
                                  )) * days;
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
                        lastTimeCronJobUpdated: timeNow.format(
                            DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON,
                        ),
                    });
                }
            });
            const userPromise = updateUsers.map((user) => {
                return queryRunner.manager.getRepository(User).update(user.id, {
                    ...user,
                });
            });
            const userSalaryPromise = updateUserSalaries.map((userSalary) => {
                return queryRunner.manager
                    .getRepository(UserSalary)
                    .update(userSalary.id, {
                        ...userSalary,
                    });
            });
            await Promise.all([userPromise, userSalaryPromise]);
            const loggingData = {
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
                ...loggingData,
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
