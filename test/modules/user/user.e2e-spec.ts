import { TestRequest } from '../../utils/request';

export class UserE2eTest {
    static runTests = () => {
        describe('UserController (e2e)', () => {
            it('should create user', async () => {
                const userBody = {
                    fullName: 'Lam Le Vu',
                    email: 'lamlevu26@gmail.com',
                    balance: 1500.0,
                };
                await TestRequest.httpServer
                    .post('/user')
                    .send(userBody)
                    .then((res) => {
                        expect(res.body.data.fullName).toEqual(
                            userBody.fullName,
                        );
                        expect(res.body.data.email).toEqual(userBody.email);
                        expect(res.body.data.balance).toEqual(
                            Number(userBody.balance).toFixed(3),
                        );
                        expect(res.statusCode).toEqual(200);
                    });
            });

            it('should delete user', async () => {
                const userBody = {
                    fullName: 'Lam Le Vu',
                    email: 'lamlevu26@gmail.com',
                    balance: 1500.0,
                };
                const createUser = await TestRequest.httpServer
                    .post('/user')
                    .send(userBody);
                const id = createUser.body.data.id;
                await TestRequest.httpServer.get(`/user/${id}`).then((res) => {
                    expect(res.statusCode).toEqual(200);
                    expect(res.body.data.fullName).toEqual(userBody.fullName);
                    expect(res.body.data.email).toEqual(userBody.email);
                    expect(res.body.data.balance).toEqual(
                        Number(userBody.balance).toFixed(3),
                    );
                });
                const deleteResponse = await TestRequest.httpServer.delete(
                    `/user/${id}`,
                );
                expect(deleteResponse.statusCode).toEqual(200);
            });
        });
    };
}
