import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuditLog } from '../../../src/entities/auditLog.entity';
import { User } from '../../../src/entities/user.entity';
import { UserSalary } from '../../../src/entities/userSalary.entity';
import { ConfigKey } from '../config/configKey';
import { FileLogger } from 'typeorm';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const options: TypeOrmModuleOptions = {
                    name: 'default',
                    type: 'postgres',
                    host: configService.get(ConfigKey.DB_HOST),
                    port: parseInt(configService.get(ConfigKey.DB_PORT)),
                    username: configService.get(ConfigKey.DB_USERNAME),
                    password: configService.get(ConfigKey.DB_PASSWORD),
                    database: configService.get(ConfigKey.DB_NAME),
                    extra: {
                        // maximum number of clients the pool should contain
                        // by default this is set to 10.
                        max: configService.get(ConfigKey.DB_CONNECTION_LIMIT),
                    },
                    entities: [User, UserSalary, AuditLog],
                    logger: new FileLogger(
                        configService.get(ConfigKey.NODE_ENV) === 'development',
                        {
                            logPath: 'logs/query.log',
                        },
                    ),
                    synchronize: false,
                };
                return options;
            },
        }),
    ],
    providers: [],
    exports: [],
})
export class DatabaseModule {}
