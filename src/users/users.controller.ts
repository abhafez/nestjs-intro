import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user/create-user.dto';
import { GetUserParamsDto } from './dto/create-user/get-user-params.dto';
import { PatchUserDto } from './dto/create-user/patch-user.dto';
import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  //#region GET /users/:id
  @Get(':id')
  getUsers(
    @Param() getUserParamsDto: GetUserParamsDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.userService.findAll(getUserParamsDto, limit, page);
  }
  //#endregion

  //#region POST /users
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return createUserDto;
  }
  //#endregion

  //#region PATCH /user/:id
  @Patch(':id')
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
  //#endregion
}
