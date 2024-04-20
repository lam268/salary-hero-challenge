import { TestRequest } from './utils/request';

export class AppE2eTest {
    static runTests = () => {
        describe('AppController (e2e)', () => {
            describe('root', () => {
                it('should return "pong"', async () => {
                    const response = await TestRequest.httpServer.get('/ping');
                    expect(response.statusCode).toEqual(200);
                    expect(response.text).toEqual('pong');
                });
            });
        });
    };
}
