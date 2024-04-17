import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { WinstonModule as NestWinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { LOG_LEVEL } from '../common.constant';
import { ConfigKey } from '../config/configKey';
import { LoggerOptions } from 'winston';

dotenv.config();

const { LOG_LEVEL: LOGGER_LEVEL, ENV_NAME, LOG_ROOT_FOLDER } = process.env;

export function createWinstonLogger(filename: string, options?: LoggerOptions) {
    return winston.createLogger({
        level: LOGGER_LEVEL,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf((info) =>
                JSON.stringify({ timestamp: info?.timestamp, ...info }),
            ),
        ),
        defaultMeta: {
            service: `${ENV_NAME ? `-${ENV_NAME}` : ''}`,
        },
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize({
                        all: true,
                        colors: {
                            info: 'green',
                            error: 'red',
                            debug: 'blue',
                            warn: 'yellow',
                        },
                    }),
                ),
            }),
            new winston.transports.DailyRotateFile({
                filename: `${LOG_ROOT_FOLDER || 'logs'}/${filename}-%DATE%.log`,
                datePattern: 'YYYY-MM-DD-HH',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
            }),
        ],
        ...options,
    });
}

@Module({
    imports: [
        NestWinstonModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return winston.createLogger({
                    level: configService.get(ConfigKey.LOG_LEVEL),
                    format: winston.format.json(),
                    defaultMeta: {
                        service: `${
                            configService.get(ConfigKey.ENV_NAME)
                                ? `-${configService.get(ConfigKey.ENV_NAME)}`
                                : ''
                        }`,
                    },
                    transports: [
                        new winston.transports.Console({
                            level: LOG_LEVEL.DEBUG,
                        }),
                        new winston.transports.DailyRotateFile({
                            filename: `${configService.get(
                                ConfigKey.LOG_ROOT_FOLDER,
                            )}-%DATE%.log`,
                            datePattern: 'YYYY-MM-DD-HH',
                            zippedArchive: true,
                            maxSize: '20m',
                            maxFiles: '14d',
                        }),
                    ],
                });
            },
        }),
    ],
    providers: [],
})
export class WinstonModule {}
