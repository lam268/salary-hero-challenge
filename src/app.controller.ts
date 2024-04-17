import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    constructor() {}

    @Get('/ping')
    pingAlive() {
        return 'pong';
    }
}
