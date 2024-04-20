import { AppE2eTest } from './app.e2e-spec';
import { TestBase } from './utils/base';
import { TestRepo } from './utils/repo';

beforeAll(async () => {
    await TestBase.init();
});

AppE2eTest.runTests();

afterEach(async () => {
    await TestRepo.clearAllRepo();
});

afterAll(async () => {
    await TestBase.close();
});
