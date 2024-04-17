export enum USER_SALARY_TYPE {
    MONTHLY = 'monthly',
    DAILY = 'daily',
}

export enum UserSalaryOrderBy {
    ID = 'userSalary.id',
    CREATED_AT = 'userSalary.createdAt',
}

export const userSalarySelectAttributes = [
    'userSalary.id',
    'userSalary.type',
    'userSalary.ratePerUnit',
    'userSalary.lastTimeCronJobUpdated',
];
