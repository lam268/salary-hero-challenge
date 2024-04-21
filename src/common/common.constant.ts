export enum AUDIT_LOG_MODULES {
    USER = 'user',
    USER_SALARY = 'user_salary',
}

export enum NODE_ENV {
    DEVELOPMENT = 'development',
    LOCAL = 'local',
}

export enum USER_ACTION {
    POST = 'create',
    PATCH = 'update',
    PATCH_STATUS = 'update_status',
    DELETE = 'delete',
    BULK_DELETE = 'bulk_delete',
    BULK_CREATE = 'bulk_create',
    LOGIN = 'login',
    CRON_JOB = 'cron_job',
}

export enum LOG_LEVEL {
    DEBUG = 'debug',
    ALL = 'all',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    FATAL = 'fatal',
    OFF = 'off',
    TRACE = 'trace',
}

export enum HttpStatus {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    INVALID_USERNAME_OR_PASSWORD = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    UNSUPPORTED_MEDIA_TYPE = 415,
    UNPROCESSABLE_ENTITY = 422,
    ITEM_NOT_FOUND = 444,
    ITEM_ALREADY_EXIST = 445,
    ITEM_IS_USING = 446,
    INTERNAL_SERVER_ERROR = 500,
    OVER_LIMIT = 447,
    ITEM_IS_INVALID = 448,
}

export const DEFAULT_SUCCESS_MESSAGE = 'success';

export const TIMEZONE_NAME_DEFAULT = 'Asia/Bangkok';

export type TYPE_ORM_ORDER_DIRECTION = 'ASC' | 'DESC';
export enum ORDER_DIRECTION {
    ASC = 'asc',
    DESC = 'desc',
}

export const MIN_PAGE_SIZE = 0;
export const MIN_PAGE = 1;
export const MAX_PAGE_SIZE = 10000;
export const MAX_PAGE = 10000;
export const INPUT_TEXT_MAX_LENGTH = 255;

export enum DATE_TIME_FORMAT {
    YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON = 'YYYY-MM-DD HH:mm:ss',
    YYYY_MM_DD_HYPHEN = 'YYYY-MM-DD',
}
