import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { i18nException } from '../app/i18n/i18n-exception.factory';
import { ZodValidationPipe } from '../app/i18n/zod-validation.pipe';
import { type CreateUserDto, createUserSchema } from './dto/create-user/create-user';

@Controller('users')
export class UsersController {
  //#region GET users/:id
  @Get(':id')
  getUsers(
    @Param('id', new ParseIntPipe({ exceptionFactory: i18nException('errors.INVALID_NUMBER_ID') }))
    id: number,
  ) {
    return id;
  }
  //#endregion

  //#region POST /users
  @Post()
  createUser(@Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto) {
    return createUserDto;
  }
  //#endregion

  //#region PATCH /user/:id
  @Patch()
  updateUser() {
    return 'Update user works fine';
  }
  //#endregion
}
