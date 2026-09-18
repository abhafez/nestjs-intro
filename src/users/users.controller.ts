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

@Controller('users')
export class UsersController {
  @Get(':id')
  getUsers(@Param() params: { id: number }, @Query('offset') query: any) {
    console.log(query);
    console.log(params);

    return params;
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
