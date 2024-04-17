import { CommonListResponse } from '../../../../common/helpers/api.response';

export class UserResponseDto {
    id: number;
    fullName: string;
    balance: number;
}

export class UserList extends CommonListResponse<UserResponseDto> {
    items: UserResponseDto[];
}
