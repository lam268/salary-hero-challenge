import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import * as dotenv from 'dotenv';
import { createWinstonLogger } from '../../../common/services/winston.service';
import { TIMEZONE_NAME_DEFAULT } from '../../../common/common.constant';

dotenv.config();

const CRON_JOB_UPDATE_USER_BALANCE =
    process.env.CRON_JOB_UPDATE_USER_BALANCE || '1 0 * * *';

@Injectable()
export class SendUpdateUserBalanceJob {
    constructor(private readonly configService: ConfigService) {
        // eslint-disable-next-line prettier/prettier
    }
    private readonly logger = createWinstonLogger(
        `user-salary-update-user-balance`,
    );

    @Cron(CRON_JOB_UPDATE_USER_BALANCE, {
        timeZone: TIMEZONE_NAME_DEFAULT,
    })
    async updateUserBalance() {
        try {
            this.logger.info('[UpdateBalance] Start cronjob');
        } catch (error) {
            this.logger.error(
                '[UpdateBalance] Error in updateUserBalance: ',
                error,
            );
        }
    }
}
