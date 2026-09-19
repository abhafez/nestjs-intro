import { Injectable } from '@nestjs/common';
import { GetUserParamsDto } from '../dto/create-user/get-user-params.dto';

@Injectable()
export class UsersService {
  //#region finaAll
  public findAll(getUserParamDto: GetUserParamsDto, limit: number, page: number) {
    return [
      {
        firstName: 'john',
        email: 'john@doe.com',
      },
      {
        firstName: 'Alice',
        email: 'Alice@wonderland.com',
      },
    ];
  }
  //#endregion
}
