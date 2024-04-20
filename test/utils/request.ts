import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

export class TestRequest {
    static httpServer;
    static init = async (app: INestApplication) => {
        this.httpServer = request(app.getHttpServer());
    };
}
