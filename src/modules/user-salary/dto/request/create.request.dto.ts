import Joi from '../../../../plugins/joi';
import { USER_SALARY_TYPE } from '../../userSalary.constant';

export class CreateUserSalaryDto {
    type: USER_SALARY_TYPE;
    ratePerUnit: number;
    userId: number;
}

export const CreateUserSalarySchema = Joi.object().keys({
    type: Joi.string()
        .valid(...Object.values(USER_SALARY_TYPE))
        .required(),
    ratePerUnit: Joi.number().strict().min(0),
    userId: Joi.number().strict().min(0),
});
