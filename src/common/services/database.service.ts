import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from '../../entities/auditLog.entity';
import { DataSource, Repository } from 'typeorm';
import { UserLoggingDto } from '../dto/user.logging.dto';

@Injectable()
export class DatabaseService {
    constructor(
        @InjectDataSource()
        private dataSource: DataSource,
        @InjectRepository(AuditLog)
        private auditLogRepo: Repository<AuditLog>,
    ) {}

    async recordUserLogging(data: UserLoggingDto) {
        try {
            const record = {
                ...data,
            } as UserLoggingDto;
            await this.dataSource.getRepository(AuditLog).save({
                ...record,
                createdAt: new Date(),
            });
        } catch (error) {
            throw error;
        }
    }
}
