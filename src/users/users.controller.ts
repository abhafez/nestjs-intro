import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user/create-user.dto';
import { GetUserParamsDto } from './dto/create-user/get-user-params.dto';
import { PatchUserDto } from './dto/create-user/patch-user.dto';
import { UsersService } from './providers/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  //#region GET /users/:id
  @ApiOperation({ summary: 'Get a user by id, or list all users' })
  @ApiParam({ name: 'id', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Page size', example: 10 })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
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
  @ApiOperation({ summary: 'Create a user' })
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return createUserDto;
  }
  //#endregion

  //#region PATCH /user/:id
  @ApiOperation({ summary: 'Update a user' })
  @Patch(':id')
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
  //#endregion
}
