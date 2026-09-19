import { Injectable } from '@nestjs/common';
import { GetUserParamsDto } from '../dto/create-user/get-user-params.dto';

@Injectable()
export class UsersService {
  //#region finaAll
  public findAll(getUserParamDto: GetUserParamsDto, limit: number, page: number) {
    console.log(getUserParamDto, limit, page);
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

  //#region findOneById
  public findOneById(id: number) {
    return {
      id: id,
      firstName: 'john',
      email: 'john@doe.com',
    };
  }
  //#endregion
}
