import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  login(id: number) {
    return this.userService.findOneById(id);
  }

  isAuth(id: number) {
    return true;
  }
}
