import Joi from '../../../src/plugins/joi';
import { LOG_LEVEL } from '../common.constant';
import { ConfigKey } from './configKey';

export default Joi.object({
    [ConfigKey.NODE_ENV]: Joi.string().required(),
    [ConfigKey.ENV_NAME]: Joi.string().required(),
    [ConfigKey.PORT]: Joi.number().default(3000),
    [ConfigKey.BASE_PATH]: Joi.string().required(),
    [ConfigKey.LOG_LEVEL]: Joi.string()
        .default(LOG_LEVEL.DEBUG)
        .valid(...Object.values(LOG_LEVEL)),
    [ConfigKey.LOG_ROOT_FOLDER]: Joi.string().default('logs'),
    [ConfigKey.DB_HOST]: Joi.string().required(),
    [ConfigKey.DB_PORT]: Joi.number().required(),
    [ConfigKey.DB_USERNAME]: Joi.string().required(),
    [ConfigKey.DB_PASSWORD]: Joi.string().required(),
    [ConfigKey.DB_NAME]: Joi.string().required(),
});
