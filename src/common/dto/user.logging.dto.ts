import { AUDIT_LOG_MODULES, USER_ACTION } from '../common.constant';

export class UserLoggingDto {
    createdBy?: number;
    module: AUDIT_LOG_MODULES;
    action: USER_ACTION;
    oldValue: any;
    newValue: any;
}
