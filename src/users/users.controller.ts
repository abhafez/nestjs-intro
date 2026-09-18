import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Headers,
  Ip,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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
    @Query('active', new ParseBoolPipe({ exceptionFactory: i18nException('errors.INVALID_BOOL') }))
    active: boolean,
    @Query(
      'offset',
      new DefaultValuePipe(10),
      new ParseIntPipe({ exceptionFactory: i18nException('errors.INVALID_NUMEBR') }),
    )
    offset: number,
  ) {
    return id;
  }
  //#endregion

  //#region POST /users
  @Post()
  createUser(
    @Body(new ZodValidationPipe(createUserSchema)) body: CreateUserDto,
    @Headers() header: any,
    @Ip() ip: any,
  ) {
    return 'safe';
  }
  //#endregion

  //#region PATCH /user/:id
  @Patch()
  updateUser() {
    return 'Update user works fine';
  }
  //#endregion
}
