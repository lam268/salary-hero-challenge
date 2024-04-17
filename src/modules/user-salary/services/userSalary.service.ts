import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../common/base/BaseService';
import { DatabaseService } from '../../../common/services/database.service';
import { UserSalary } from '../../../entities/userSalary.entity';
import { DataSource } from 'typeorm';
import {
    UserSalaryOrderBy,
    userSalarySelectAttributes,
} from '../userSalary.constant';
import { userSelectAttributes } from '../../../modules/user/user.constant';
import { UserSalaryListQueryStringDto } from '../dto/request/get.request.dto';
import {
    ORDER_DIRECTION,
    TYPE_ORM_ORDER_DIRECTION,
} from '../../../common/common.constant';
import {
    UserSalaryList,
    UserSalaryResponseDto,
} from '../dto/response/api.response.dto';
import { CreateUserSalaryDto } from '../dto/request/create.request.dto';
import { UpdateUserSalaryDto } from '../dto/request/update.request.dto';

@Injectable()
export class UserSalaryService extends BaseService {
    constructor(
        protected dataSource: DataSource,
        readonly databaseService: DatabaseService,
    ) {
        super();
    }

    get userSalaryRepo() {
        return this.dataSource.getRepository(UserSalary);
    }

    async getUserSalaryById(id: number) {
        try {
            const userSalary = await this.userSalaryRepo
                .createQueryBuilder('userSalary')
                .leftJoinAndSelect('userSalary.user', 'user')
                .select([
                    ...userSelectAttributes,
                    ...userSalarySelectAttributes,
                ])
                .where({ id })
                .getOne();
            return userSalary;
        } catch (error) {
            this.logger.error('Error in getUserSalaryById', error);
            throw error;
        }
    }

    async getUserSalaryByUserId(userId: number, excludeId?: number) {
        try {
            const _queryBuilder = await this.userSalaryRepo
                .createQueryBuilder('userSalary')
                .leftJoinAndSelect('userSalary.user', 'user')
                .select([
                    ...userSelectAttributes,
                    ...userSalarySelectAttributes,
                ])
                .where({ userId });
            if (excludeId)
                _queryBuilder.andWhere('id <> :excludeId', {
                    excludeId,
                });
            const userSalary = await _queryBuilder.getOne();
            return userSalary;
        } catch (error) {
            this.logger.error('Error in getUserSalaryByUserId', error);
            throw error;
        }
    }

    async deleteUserSalary(
        userSalary: UserSalary,
        id: number,
        deletedBy: number,
    ): Promise<void> {
        try {
            const timeNow = new Date();
            await this.userSalaryRepo.update(
                { id },
                {
                    deletedAt: timeNow,
                    deletedBy,
                },
            );
        } catch (error) {
            this.logger.error('Error in deleteUserSalary', error);
            throw error;
        }
    }

    async getUserSalaries(
        query: UserSalaryListQueryStringDto,
    ): Promise<UserSalaryList> {
        try {
            const {
                page,
                limit,
                orderBy = UserSalaryOrderBy.CREATED_AT,
                orderDirection = ORDER_DIRECTION.ASC,
            } = query;
            const _queryBuilder = this.userSalaryRepo
                .createQueryBuilder('user')
                .leftJoinAndSelect('userSalary.user', 'user');
            _queryBuilder.select([
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

    async createUserSalary(data: CreateUserSalaryDto) {
        try {
            const saveUserSalary = await this.userSalaryRepo.save(data);
            return await this.getUserSalaryById(saveUserSalary.id);
        } catch (error) {
            this.logger.error('Error in createUser', error);
            throw error;
        }
    }

    async updateUserSalary(
        id: number,
        data: UpdateUserSalaryDto,
    ): Promise<UserSalaryResponseDto> {
        try {
            await this.userSalaryRepo.update(id, data);
            return this.getUserSalaryById(id);
        } catch (error) {
            this.logger.error('Error in updateUser', error);
        }
    }
}
