import { Injectable } from '@nestjs/common';
import { User } from '../../../entities/user.entity';
import { Brackets, DataSource, Like } from 'typeorm';
import { UserList, UserResponseDto } from '../dto/response/api.response.dto';
import { BaseService } from '../../../common/base/BaseService';
import { UserOrderBy, userSelectAttributes } from '../user.constant';
import { UpdateUserDto } from '../dto/request/update.request.dto';
import {
    ORDER_DIRECTION,
    TYPE_ORM_ORDER_DIRECTION,
} from '../../../common/common.constant';
import { UserListQueryStringDto } from '../dto/request/get.request.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/request/create.request.dto';
import { userSalarySelectAttributes } from '../../../modules/user-salary/userSalary.constant';

@Injectable()
export class UserService extends BaseService {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) {
        super();
    }

    get userRepo() {
        return this.dataSource.getRepository(User);
    }

    async getUsers(query: UserListQueryStringDto): Promise<UserList> {
        try {
            const {
                page,
                limit,
                keyword = '',
                orderBy = UserOrderBy.CREATED_AT,
                orderDirection = ORDER_DIRECTION.ASC,
            } = query;
            const _queryBuilder = this.userRepo
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.userSalary', 'userSalary');
            _queryBuilder
                .where((queryBuilder) => {
                    if (keyword) {
                        queryBuilder.andWhere(
                            new Brackets((qb) => {
                                qb.where({
                                    fullName: Like(`%${keyword}%`),
                                });
                                qb.orWhere({
                                    email: Like(`%${keyword}%`),
                                });
                            }),
                        );
                    }
                })
                .select([
                    ...userSelectAttributes,
                    ...userSalarySelectAttributes,
                ]);
            if (orderBy) {
                _queryBuilder.orderBy(
                    orderBy,
                    orderDirection.toUpperCase() as TYPE_ORM_ORDER_DIRECTION,
                );
            }
            if (limit && page)
                _queryBuilder.take(limit).skip((page - 1) * limit);
            const [items, totalItems] = await _queryBuilder.getManyAndCount();
            return {
                items,
                totalItems,
            };
        } catch (error) {
            this.logger.error('Error in getUsers', error);
        }
    }

    async getUserById(id: number): Promise<UserResponseDto> {
        try {
            const user = await this.userRepo
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.userSalary', 'userSalary')
                .where({ id })
                .select([
                    ...userSelectAttributes,
                    ...userSalarySelectAttributes,
                ])
                .getOne();
            return user;
        } catch (error) {
            this.logger.error('Error in getUserById', error);
            throw error;
        }
    }

    async getUserByFullName(fullName: string, excludeId?: number) {
        try {
            const _queryBuilder = await this.userRepo
                .createQueryBuilder('user')
                .where({ fullName });
            if (excludeId)
                _queryBuilder.andWhere('id <> :excludeId', {
                    excludeId,
                });
            const user = await _queryBuilder.getOne();
            return user;
        } catch (error) {
            this.logger.error('Error in getUserByFullName', error);
            throw error;
        }
    }

    async getUserByEmail(email: string, excludeId?: number) {
        try {
            const _queryBuilder = await this.userRepo
                .createQueryBuilder('user')
                .where({ email });
            if (excludeId)
                _queryBuilder.andWhere('id <> :excludeId', {
                    excludeId,
                });
            const user = await _queryBuilder.getOne();
            return user;
        } catch (error) {
            this.logger.error('Error in getUserByEmail', error);
        }
    }

    async createUser(data: CreateUserDto) {
        try {
            const saveUser = await this.userRepo.save(data);
            return await this.getUserById(saveUser.id);
        } catch (error) {
            this.logger.error('Error in createUser', error);
            throw error;
        }
    }

    async updateUser(
        id: number,
        user: UpdateUserDto,
    ): Promise<UserResponseDto> {
        try {
            await this.userRepo.update(id, user);
            return this.getUserById(id);
        } catch (error) {
            this.logger.error('Error in updateUser', error);
        }
    }

    async deleteUser(id: number, deletedBy: number): Promise<void> {
        try {
            const timeNow = new Date();
            await this.userRepo.update(
                { id },
                {
                    deletedAt: timeNow,
                    deletedBy,
                },
            );
        } catch (error) {
            throw error;
        }
    }
}
