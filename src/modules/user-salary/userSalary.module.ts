import { Module } from '@nestjs/common';
import { UserSalaryController } from './userSalary.controller';
import { UserSalaryService } from './services/userSalary.service';
import { DatabaseService } from '../../common/services/database.service';
import { UserService } from '../user/services/user.service';
import { SendUpdateUserBalanceJob } from './cron-jobs/updateUserBalance';

@Module({
    imports: [],
    controllers: [UserSalaryController],
    providers: [
        UserSalaryService,
        DatabaseService,
        UserService,
        SendUpdateUserBalanceJob,
    ],
})
export class UserSalaryModule {}
