import {
    INPUT_TEXT_MAX_LENGTH,
    MAX_PAGE,
    MAX_PAGE_SIZE,
    MIN_PAGE,
    MIN_PAGE_SIZE,
    ORDER_DIRECTION,
} from '../../../../common/common.constant';
import Joi from '../../../../plugins/joi';
import { UserOrderBy } from '../../user.constant';

export class UserListQueryStringDto {
    page?: number;
    limit?: number;
    keyword?: string;
    orderBy?: string;
    orderDirection?: ORDER_DIRECTION;
}

export class IUserListQueryString {
    page?: number;
    limit?: number;
    keyword?: string;
    orderBy?: string;
    orderDirection?: ORDER_DIRECTION;
}

export const UserListQueryStringSchema = Joi.object().keys({
    page: Joi.number().optional().min(MIN_PAGE).max(MAX_PAGE),
    limit: Joi.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).optional(),
    keyword: Joi.string().max(INPUT_TEXT_MAX_LENGTH).optional().trim(),
    orderBy: Joi.string()
        .valid(...Object.values(UserOrderBy))
        .optional(),
    orderDirection: Joi.string()
        .valid(...Object.values(ORDER_DIRECTION))
        .optional(),
});
