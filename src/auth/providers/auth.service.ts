import { Injectable } from '@nestjs/common';
import { SignInDto } from '../dto/signInDto';
import { SignInProvider } from './sign-in.provider';

/** Authentication logic, kept separate from `UsersService` to avoid a circular module dependency. */
@Injectable()
export class AuthService {
  /**
   * Creates the service.
   * @param signInProvider verifies credentials
   */
  constructor(private readonly signInProvider: SignInProvider) {}

  //#region signIn
  /**
   * Looks up the user being logged in.
   * @param signInDto
   */
  async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }
  //#endregion
}
