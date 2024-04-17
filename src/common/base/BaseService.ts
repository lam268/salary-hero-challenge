import { createWinstonLogger } from '../services/winston.service';

export class BaseService {
    logger = createWinstonLogger(this.constructor.name);
}
