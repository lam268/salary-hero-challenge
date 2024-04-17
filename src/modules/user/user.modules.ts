import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { DatabaseService } from '../../common/services/database.service';

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService, DatabaseService],
})
export class UserModule {}
