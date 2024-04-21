import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    InternalServerErrorException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import {
    AUDIT_LOG_MODULES,
    HttpStatus,
    USER_ACTION,
} from '../../common/common.constant';
import {
    ErrorResponse,
    SuccessResponse,
} from '../../common/helpers/api.response';
import { UserSalaryService } from './services/userSalary.service';
import { DatabaseService } from '../../common/services/database.service';
import { RemoveEmptyQueryPipe } from '../../common/pipes/remove.empty.pipe';
import { TrimObjectPipe } from '../../common/pipes/trim.object.pipe';
import { JoiValidationPipe } from '../../common/pipes/joi.validate.pipe';
import {
    IUserSalaryListQueryString,
    UserSalaryListQueryStringSchema,
} from './dto/request/get.request.dto';
import {
    UpdateUserSalaryDto,
    UpdateUserSalarySchema,
} from './dto/request/update.request.dto';
import { UserSalaryList } from './dto/response/api.response.dto';
import { CreateUserSalaryDto } from './dto/request/create.request.dto';
import { SendUpdateUserBalanceJob } from './cron-jobs/updateUserBalance';

@Controller('user-salary')
export class UserSalaryController {
    constructor(
        private userSalaryService: UserSalaryService,
        private databaseService: DatabaseService,
        private updateBalanceJobService: SendUpdateUserBalanceJob,
    ) {}

    @Get()
    async getUserSalaryList(
        @Query(
            new RemoveEmptyQueryPipe(),
            new TrimObjectPipe(),
            new JoiValidationPipe(UserSalaryListQueryStringSchema),
        )
        query: IUserSalaryListQueryString,
    ) {
        try {
            const data: UserSalaryList =
                await this.userSalaryService.getUserSalaries(query);
            return new SuccessResponse(data);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Get(':id')
    async getUserSalaryById(@Param('id', ParseIntPipe) id: number) {
        try {
            const userSalary =
                await this.userSalaryService.getUserSalaryById(id);
            if (!userSalary) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'User salary not found',
                    [],
                );
            }
            return new SuccessResponse(userSalary);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Post('trigger-update-user-balance')
    @HttpCode(HttpStatus.OK)
    async triggerUpdateUserBalance() {
        try {
            await this.updateBalanceJobService.updateUserBalance();
            return new SuccessResponse();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    async createUserSalary(
        @Body(
            new TrimObjectPipe(),
            new JoiValidationPipe(UpdateUserSalarySchema),
        )
        body: CreateUserSalaryDto,
    ) {
        try {
            const userSalaryByUserId =
                await this.userSalaryService.getUserSalaryByUserId(body.userId);
            if (userSalaryByUserId) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'User has salary setting',
                    [],
                );
            }
            const userSalary =
                await this.userSalaryService.createUserSalary(body);
            await this.databaseService.recordUserLogging({
                createdBy: 1,
                action: USER_ACTION.POST,
                module: AUDIT_LOG_MODULES.USER_SALARY,
                oldValue: null,
                newValue: {
                    ...userSalary,
                },
            });
            return new SuccessResponse(userSalary);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Patch(':id')
    async updateUserSalary(
        @Param('id', ParseIntPipe) id: number,
        @Body(
            new TrimObjectPipe(),
            new JoiValidationPipe(UpdateUserSalarySchema),
        )
        body: UpdateUserSalaryDto,
    ) {
        try {
            const existedUserSalary =
                await this.userSalaryService.getUserSalaryById(id);
            if (!existedUserSalary) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'User salary not found',
                    [],
                );
            }
            const userSalaryByUserId =
                await this.userSalaryService.getUserSalaryByUserId(
                    body.userId,
                    id,
                );
            if (userSalaryByUserId) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'User has salary setting',
                    [],
                );
            }
            const userSalary = await this.userSalaryService.updateUserSalary(
                id,
                body,
            );
            await this.databaseService.recordUserLogging({
                createdBy: 1,
                action: USER_ACTION.PATCH,
                module: AUDIT_LOG_MODULES.USER_SALARY,
                oldValue: {
                    ...existedUserSalary,
                },
                newValue: {
                    ...userSalary,
                },
            });
            return new SuccessResponse(userSalaryByUserId);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Delete(':id')
    async deleteUserSalary(@Param('id', ParseIntPipe) id: number) {
        try {
            const userSalary =
                await this.userSalaryService.getUserSalaryById(id);
            if (!userSalary) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'User salary not found',
                    [],
                );
            }
            await this.userSalaryService.deleteUserSalary(userSalary, id, 1);
            await this.databaseService.recordUserLogging({
                createdBy: 1,
                action: USER_ACTION.DELETE,
                module: AUDIT_LOG_MODULES.USER_SALARY,
                oldValue: {
                    ...userSalary,
                },
                newValue: {},
            });
            return new SuccessResponse({});
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
