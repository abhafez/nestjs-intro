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
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { i18nException } from '../app/i18n/i18n-exception.factory';

@Controller('users')
export class UsersController {
  //#region GET /:id
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
    console.log(offset, active);

    return id;
  }
  //#endregion

  // same three pipes, same i18nException factory, different resource:
  // ParseUUIDPipe needs its own route param since :id above is already an int.
  @Get('by-uuid/:uuid')
  getUserByUuid(
    @Param('uuid', new ParseUUIDPipe({ exceptionFactory: i18nException('errors.INVALID_UUID') }))
    uuid: string,
  ) {
    return uuid;
  }

  @Post()
  createUser(@Body() body: any, @Headers() header: any, @Ip() ip: any) {
    console.log(body);
    console.log(ip);
    console.log(header);

    return 'safe';
  }

  @Patch()
  updateUser() {
    return 'Update user works fine';
  }
}
