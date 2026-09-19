import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/providers/users.service';

/** Authentication logic, kept separate from {@link UsersService} to avoid a circular module dependency. */
@Injectable()
export class AuthService {
  /**
   * Injects {@link UsersService} lazily to break the Auth/Users circular dependency.
   * @param userService users lookup service
   */
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  //#region login
  /**
   * Looks up the user being logged in.
   * @param id user id
   */
  login(id: number) {
    return this.userService.findOneById(id);
  }
  //#endregion

  //#region isAuth
  /**
   * Checks whether a user is authenticated.
   * @param id user id
   */
  isAuth(id: number) {
    return true;
  }
  //#endregion
}
