import { CommonListResponse } from '../../../../common/helpers/api.response';
import { USER_SALARY_TYPE } from '../../userSalary.constant';

export class UserSalaryResponseDto {
    id: number;
    type: USER_SALARY_TYPE;
    ratePerUnit: number;
    userId: number;
}

export class UserSalaryList extends CommonListResponse<UserSalaryResponseDto> {
    items: UserSalaryResponseDto[];
}
