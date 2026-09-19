import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/providers/users.service';
import { LoginDto } from './dto/login.dto';

/** Handles authentication routes. */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  //#region POST /auth/login
  /**
   * Logs a user in by email and password.
   * @param loginDto credentials submitted by the client
   */
  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiResponse({ status: 200, description: 'Login succeeded' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const id = loginDto.email as unknown as number;
    return this.authService.login(id);
  }
  //#endregion
}
