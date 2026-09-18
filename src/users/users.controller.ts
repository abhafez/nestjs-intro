import {
  Body,
  Controller,
  Get,
  Headers,
  Ip,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { I18nParseIntPipe } from '../app/i18n/i18n-parse-int.pipe';

@Controller('users')
export class UsersController {
  @Get(':id')
  getUsers(
    @Param('id', I18nParseIntPipe) id: number,
    @Query('offset') query: any,
  ) {
    console.log(query);
    console.log(id);

    return id;
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
