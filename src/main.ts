import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as express from 'express';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { transports } from 'winston';
import { AppModule } from './app.module';
import { ConfigKey } from './common/config/configKey';

const { combine, timestamp, prettyPrint, colorize, simple } = winston.format;

async function bootstrap() {
    const path = process.env.LOG_ROOT_FOLDER || 'logs';
    const ENABLE_LOG_TO_FILE = !!Number(process.env.ENABLE_LOG_TO_FILE || 0);
    const loggerTransports: winston.transport[] = [
        // we also want to see logs in our console
        new transports.Console({
            format: combine(colorize(), simple()),
        }),
        new transports.Console({
            format: combine(prettyPrint()),
            level: 'error',
        }),
    ];
    if (ENABLE_LOG_TO_FILE) {
        loggerTransports.push(
            new winston.transports.DailyRotateFile({
                filename: `${path}/error-%DATE%.log`,
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                level: 'error',
                format: combine(
                    timestamp({
                        format: 'YYYY-MM-DD HH:mm:ss',
                    }),
                    prettyPrint(),
                ),
            }),
        );
    }
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: WinstonModule.createLogger({
            transports: loggerTransports,
        }),
    });
    app.use(helmet());
    // set up CORS
    const configService: ConfigService = app.get(ConfigService);
    const corsOptions: CorsOptions = {
        origin: '*',
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'accept-language',
            'X-Timezone',
            'X-Timezone-Name',
            'Tnid',
            'Ptoken',
            'device-token',
        ],
        optionsSuccessStatus: 200,
        methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    };
    app.enableCors(corsOptions);
    // setup prefix of route
    app.setGlobalPrefix(configService.get(ConfigKey.BASE_PATH));
    // setup max request size
    app.use(
        express.json({ limit: configService.get(ConfigKey.MAX_REQUEST_SIZE) }),
    );
    app.use(
        express.urlencoded({
            limit: configService.get(ConfigKey.MAX_REQUEST_SIZE),
            extended: true,
        }),
    );
    await app.listen(configService.get(ConfigKey.PORT));
}
bootstrap();
