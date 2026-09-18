import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user/create-user.dto';
import { GetUserParamsDto } from './dto/create-user/get-user-params.dto';

@Controller('users')
export class UsersController {
  //#region GET users/:id
  @Get(':id')
  getUsers(@Param() getUserParamsDto: GetUserParamsDto) {
    return getUserParamsDto;
  }
  //#endregion

  //#region POST /users
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
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
