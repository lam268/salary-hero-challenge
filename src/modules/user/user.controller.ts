import {
    Body,
    Controller,
    Delete,
    Get,
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
} from '../../../src/common/helpers/api.response';
import { JoiValidationPipe } from '../../../src/common/pipes/joi.validate.pipe';
import { RemoveEmptyQueryPipe } from '../../../src/common/pipes/remove.empty.pipe';
import { TrimObjectPipe } from '../../../src/common/pipes/trim.object.pipe';
import { DatabaseService } from '../../../src/common/services/database.service';
import {
    CreateUserDto,
    CreateUserSchema,
} from './dto/request/create.request.dto';
import {
    IUserListQueryString,
    UserListQueryStringSchema,
} from './dto/request/get.request.dto';
import {
    UpdateUserDto,
    UpdateUserSchema,
} from './dto/request/update.request.dto';
import { UserList } from './dto/response/api.response.dto';
import { UserService } from './services/user.service';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private databaseService: DatabaseService,
    ) {}

    @Get()
    async getUsers(
        @Query(
            new RemoveEmptyQueryPipe(),
            new TrimObjectPipe(),
            new JoiValidationPipe(UserListQueryStringSchema),
        )
        query: IUserListQueryString,
    ) {
        try {
            const data: UserList = await this.userService.getUsers(query);
            return new SuccessResponse(data);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number) {
        try {
            const user = await this.userService.getUserById(id);
            if (!user) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'User not found',
                    [],
                );
            }
            return new SuccessResponse(user);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Post()
    async createUser(
        @Body(new TrimObjectPipe(), new JoiValidationPipe(CreateUserSchema))
        body: CreateUserDto,
    ) {
        try {
            const isEmailExisted = await this.userService.getUserByEmail(
                body.email,
            );
            if (isEmailExisted) {
                return new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    `User's email is existed`,
                    [],
                );
            }
            const user = await this.userService.createUser(body);
            await this.databaseService.recordUserLogging({
                userId: 1,
                action: USER_ACTION.DELETE,
                module: AUDIT_LOG_MODULES.USER_SALARY,
                oldValue: null,
                newValue: {
                    ...user,
                },
            });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Patch(':id')
    async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body(new TrimObjectPipe(), new JoiValidationPipe(UpdateUserSchema))
        body: UpdateUserDto,
    ) {
        try {
            const user = await this.userService.getUserById(id);
            if (!user) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'User not found',
                    [],
                );
            }
            const isEmailExisted = await this.userService.getUserByEmail(
                body.email,
                id,
            );
            if (isEmailExisted) {
                return new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    `User's email is existed`,
                    [],
                );
            }
            await this.userService.updateUser(id, body);
            await this.databaseService.recordUserLogging({
                userId: 1,
                action: USER_ACTION.DELETE,
                module: AUDIT_LOG_MODULES.USER_SALARY,
                oldValue: {
                    ...user,
                },
                newValue: {
                    ...user,
                },
            });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        try {
            const user = await this.userService.getUserById(id);
            if (!user) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'User not found',
                    [],
                );
            }
            // Assume loginUserId = 1
            await this.userService.deleteUser(id, 1);
            await this.databaseService.recordUserLogging({
                userId: 1,
                action: USER_ACTION.DELETE,
                module: AUDIT_LOG_MODULES.USER_SALARY,
                oldValue: {
                    ...user,
                },
                newValue: {},
            });
            return new SuccessResponse({});
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
