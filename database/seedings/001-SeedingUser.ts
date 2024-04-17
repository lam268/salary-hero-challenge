import { TABLE_NAME } from '../database.constant';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class SeedingUser1686649812852 implements Seeder {
    track = true;

    public async run(dataSource: DataSource): Promise<void> {
        await dataSource.getRepository(TABLE_NAME.USER).insert({
            fullName: 'Le Vu Lam',
            email: 'lamlevu2610@gmail.com',
            balance: 0,
        });
    }
}
