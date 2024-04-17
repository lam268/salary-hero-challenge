import {
    MAX_PAGE,
    MAX_PAGE_SIZE,
    MIN_PAGE,
    MIN_PAGE_SIZE,
    ORDER_DIRECTION,
} from '../../../../common/common.constant';
import Joi from '../../../../plugins/joi';
import { UserSalaryOrderBy } from '../../userSalary.constant';

export class UserSalaryListQueryStringDto {
    page?: number;
    limit?: number;
    fullName?: string;
    orderBy?: string;
    orderDirection?: ORDER_DIRECTION;
}

export class IUserSalaryListQueryString {
    page?: number;
    limit?: number;
    keyword?: string;
    orderBy?: string;
    orderDirection?: ORDER_DIRECTION;
}

export const UserSalaryListQueryStringSchema = Joi.object().keys({
    page: Joi.number().optional().min(MIN_PAGE).max(MAX_PAGE),
    limit: Joi.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).optional(),
    orderBy: Joi.string()
        .valid(...Object.values(UserSalaryOrderBy))
        .optional(),
    orderDirection: Joi.string()
        .valid(...Object.values(ORDER_DIRECTION))
        .optional(),
});
