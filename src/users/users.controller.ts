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
  createUser(@Body() body: any, @Headers() header: any, @Ip() ip: any) {
    console.log(body);
    console.log(ip);
    console.log(header);

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
