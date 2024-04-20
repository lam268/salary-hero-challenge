import { Module } from '@nestjs/common';
import { UserSalaryController } from './userSalary.controller';
import { UserSalaryService } from './services/userSalary.service';
import { DatabaseService } from '../../common/services/database.service';
import { UserService } from '../user/services/user.service';
import { SendUpdateUserBalanceJob } from './cron-jobs/updateUserBalance';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { UserSalary } from '../../entities/userSalary.entity';
import { AuditLog } from '../../entities/auditLog.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserSalary, AuditLog])],
    controllers: [UserSalaryController],
    providers: [
        UserSalaryService,
        DatabaseService,
        UserService,
        SendUpdateUserBalanceJob,
    ],
})
export class UserSalaryModule {}
