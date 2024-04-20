import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { DatabaseService } from '../../common/services/database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { AuditLog } from '../../entities/auditLog.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, AuditLog])],
    controllers: [UserController],
    providers: [UserService, DatabaseService],
})
export class UserModule {}
