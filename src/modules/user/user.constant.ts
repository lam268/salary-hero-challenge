export const userSelectAttributes = [
    'user.id',
    'user.fullName',
    'user.email',
    'user.balance',
];

export enum UserOrderBy {
    ID = 'user.id',
    CREATED_AT = 'user.createdAt',
    FULL_NAME = 'user.fullName',
    BALANCE = 'user.balance',
}
