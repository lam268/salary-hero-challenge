import { TestRequest } from '../../utils/request';
import { TestRepo } from '../../utils/repo';
import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from '../../../src/common/common.constant';
import { USER_SALARY_TYPE } from '../../../src/modules/user-salary/userSalary.constant';

export class UserSalaryE2eTest {
    static runTests = () => {
        describe('UserSalaryController (e2e)', () => {
            it('should create user salary', async () => {
                const userBody = {
                    fullName: 'Lam Le Vu',
                    email: 'lamlevu26@gmail.com',
                    balance: 1500.0,
                };
                const createUser = await TestRequest.httpServer
                    .post('/user')
                    .send(userBody);
                const userId = createUser.body.data.id;
                const userSalaryBody = {
                    userId,
                    type: 'daily',
                    ratePerUnit: 100,
                };
                await TestRequest.httpServer
                    .post('/user-salary')
                    .send(userSalaryBody)
                    .then((res) => {
                        expect(res.statusCode).toEqual(200);
                        expect(res.body.data.user.id).toEqual(
                            userSalaryBody.userId,
                        );
                        expect(res.body.data.type).toEqual(userSalaryBody.type);
                        expect(res.body.data.ratePerUnit).toEqual(
                            Number(userSalaryBody.ratePerUnit).toFixed(3),
                        );
                    });
            });

            it('should delete user salary', async () => {
                const userBody = {
                    fullName: 'Lam Le Vu',
                    email: 'lamlevu26@gmail.com',
                    balance: 1500.0,
                };
                const createUser = await TestRequest.httpServer
                    .post('/user')
                    .send(userBody);
                const userId = createUser.body.data.id;
                const userSalaryBody = {
                    userId,
                    type: 'daily',
                    ratePerUnit: 100,
                };
                const createdUserSalary = await TestRequest.httpServer
                    .post('/user-salary')
                    .send(userSalaryBody);
                const userSalaryId = createdUserSalary.body.data.id;
                await TestRequest.httpServer
                    .delete(`/user-salary/${userSalaryId}`)
                    .then((res) => {
                        expect(res.statusCode).toEqual(200);
                    });
            });

            it('should run query job user salary', async () => {
                const userBody1 = {
                    fullName: 'test 1',
                    email: 'test1@gmail.com',
                    balance: 1000.0,
                };
                const userBody2 = {
                    fullName: 'test 2',
                    email: 'test2@gmail.com',
                    balance: 1500.0,
                };
                const userBody3 = {
                    fullName: 'test 3',
                    email: 'test3@gmail.com',
                    balance: 1500.0,
                };
                const userBody4 = {
                    fullName: 'test 4',
                    email: 'test4@gmail.com',
                    balance: 1200.0,
                };
                const userBody5 = {
                    fullName: 'test 5',
                    email: 'test5@gmail.com',
                    balance: 1000.0,
                };
                const createUser1 = await TestRequest.httpServer
                    .post('/user')
                    .send(userBody1);
                const createUser2 = await TestRequest.httpServer
                    .post('/user')
                    .send(userBody2);
                const createUser3 = await TestRequest.httpServer
                    .post('/user')
                    .send(userBody3);
                const createUser4 = await TestRequest.httpServer
                    .post('/user')
                    .send(userBody4);
                const createUser5 = await TestRequest.httpServer
                    .post('/user')
                    .send(userBody5);
                const userId1 = createUser1.body.data.id;
                const userId2 = createUser2.body.data.id;
                const userId3 = createUser3.body.data.id;
                const userId4 = createUser4.body.data.id;
                const userId5 = createUser5.body.data.id;
                const userSalaryBody1 = {
                    userId: userId1,
                    type: 'daily',
                    ratePerUnit: 150,
                };
                const userSalaryBody2 = {
                    userId: userId2,
                    type: 'monthly',
                    ratePerUnit: 3000,
                };
                const userSalaryBody3 = {
                    userId: userId3,
                    type: 'monthly',
                    ratePerUnit: 2000,
                };
                const userSalaryBody4 = {
                    userId: userId4,
                    type: 'daily',
                    ratePerUnit: 200,
                };
                const userSalaryBody5 = {
                    userId: userId5,
                    type: 'daily',
                    ratePerUnit: 200,
                };
                await TestRequest.httpServer
                    .post('/user-salary')
                    .send(userSalaryBody1);
                await TestRequest.httpServer
                    .post('/user-salary')
                    .send(userSalaryBody2);
                const userSalaryResponse3 = await TestRequest.httpServer
                    .post('/user-salary')
                    .send(userSalaryBody3);
                const userSalaryResponse4 = await TestRequest.httpServer
                    .post('/user-salary')
                    .send(userSalaryBody4);
                const userSalaryResponse5 = await TestRequest.httpServer
                    .post('/user-salary')
                    .send(userSalaryBody5);
                await TestRepo.userSalaryRepo.save({
                    ...userSalaryResponse3.body.data,
                    lastTimeCronJobUpdated: dayjs()
                        .subtract(1, 'day')
                        .format(
                            DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON,
                        ),
                });
                await TestRepo.userSalaryRepo.save({
                    ...userSalaryResponse4.body.data,
                    lastTimeCronJobUpdated: dayjs(),
                });
                await TestRepo.userSalaryRepo.save({
                    ...userSalaryResponse5.body.data,
                    lastTimeCronJobUpdated: dayjs()
                        .subtract(3, 'day')
                        .format(
                            DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON,
                        ),
                });
                const oldUserResponse =
                    await TestRequest.httpServer.get('/user');
                const oldUserItems = oldUserResponse.body.data.items;
                const response = await TestRequest.httpServer.post(
                    '/user-salary/trigger-update-user-balance',
                );
                expect(response.statusCode).toEqual(200);
                await TestRequest.httpServer.get('/user').then((res) => {
                    expect(res.statusCode).toEqual(200);
                    const items = res.body.data.items;
                    const dayInMonth = Number(dayjs().daysInMonth());
                    for (let i = 0; i < items.length; i++) {
                        const oldData = oldUserItems.find(
                            (item) => item.id === items[i].id,
                        );
                        const userSalary = oldData.userSalary;
                        const days = Math.abs(
                            dayjs().diff(
                                dayjs(userSalary.lastTimeCronJobUpdated),
                                'days',
                            ),
                        );
                        if (
                            !oldData.userSalary.lastTimeCronJobUpdated ||
                            dayjs(userSalary.lastTimeCronJobUpdated).format(
                                DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN,
                            ) <
                                dayjs().format(
                                    DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN,
                                )
                        ) {
                            let balance = Number(oldData.balance);
                            balance +=
                                (userSalary.type === `${USER_SALARY_TYPE.DAILY}`
                                    ? Number(userSalary.ratePerUnit)
                                    : Number(
                                          (
                                              userSalary.ratePerUnit /
                                              dayInMonth
                                          ).toFixed(3),
                                      )) * days;
                            expect(`${Number(balance).toFixed(3)}`).toEqual(
                                items[i].balance,
                            );
                        }
                    }
                });
                await TestRequest.httpServer.get('/user-salary').then((res) => {
                    expect(res.statusCode).toEqual(200);
                    const items = res.body.data.items;
                    items.forEach((item) => {
                        const lastTimeCronJobUpdated = dayjs(
                            item.lastTimeCronJobUpdated,
                        ).format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN);
                        expect(lastTimeCronJobUpdated).toEqual(
                            dayjs().format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
                        );
                    });
                });
            });
        });
    };
}
