import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/providers/users.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiResponse({ status: 200, description: 'Login succeeded' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const id = loginDto.email as unknown as number;
    return this.authService.login(id);
  }
}
