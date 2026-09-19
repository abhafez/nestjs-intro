import { Inject, Injectable } from '@nestjs/common';
import { GetUserParamsDto } from '../dto/create-user/get-user-params.dto';
import { AuthService } from '../../auth/auth.service';

/** Business logic for users. */
@Injectable()
export class UsersService {
  /**
   * Creates the service.
   * @param authService injected for future auth-aware user queries
   */
  constructor(
    @Inject()
    private readonly authService: AuthService,
  ) {}
  //#region finaAll
  /**
   * Finds a single user by id if `getUserParamDto.id` is set, otherwise
   * lists users page by page.
   * @param getUserParamDto route params, optionally carrying a single user id
   * @param limit page size
   * @param page page number
   */
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
  /**
   * Finds a single user by id.
   * @param id user id
   */
  public findOneById(id: number) {
    return {
      id: id,
      firstName: 'john',
      email: 'john@doe.com',
    };
  }
  //#endregion
}
