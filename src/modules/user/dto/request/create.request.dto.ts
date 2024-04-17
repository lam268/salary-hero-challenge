import Joi from '../../../../plugins/joi';

export class CreateUserDto {
    fullName: string;
    email: string;
    balance: number;
}

export const CreateUserSchema = Joi.object().keys({
    fullName: Joi.string().trim().optional(),
    email: Joi.string().trim().required().email(),
    balance: Joi.number().strict().min(0),
});
