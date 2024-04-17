import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import envSchema from './common/config/validationSchema';
import { UserModule } from './modules/user/user.modules';
import { DatabaseModule } from './common/services/database.module';
import { UserSalaryModule } from './modules/user-salary/userSalary.module';
import { WinstonModule } from 'nest-winston';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            validationSchema: envSchema,
        }),
        UserModule,
        UserSalaryModule,
        DatabaseModule,
        WinstonModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
