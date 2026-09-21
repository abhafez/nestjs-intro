import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './providers/auth.service';
import { UsersService } from '../users/providers/users.service';
import { SignInDto } from './dto/signInDto';

/** Handles authentication routes. */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  //#region POST /auth/signIn
  /**
   * Logs a user in by email and password.
   * @param signInDto credentials submitted by the client
   */
  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiResponse({ status: 200, description: 'Login succeeded' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  login(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
  //#endregion
}
