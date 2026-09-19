import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user/create-user.dto';
import { GetUserParamsDto } from './dto/create-user/get-user-params.dto';
import { PatchUserDto } from './dto/create-user/patch-user.dto';
import { UsersService } from './providers/users.service';

/** User CRUD routes. */
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  //#region GET /users/:id
  /**
   * Gets a single user by id, or lists users page by page.
   * @param getUserParamsDto route params, optionally carrying a single user id
   * @param limit page size
   * @param page page number
   */
  @ApiOperation({ summary: 'Get a user by id, or list all users' })
  @ApiParam({ name: 'id', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Page size', example: 10 })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiResponse({ status: 200, description: 'Users returned' })
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
  /**
   * Creates a user.
   * @param createUserDto user data
   */
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto)
  }
  //#endregion

  //#region PATCH /user/:id
  /**
   * Updates a user.
   * @param patchUserDto fields to update
   */
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @Patch(':id')
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
  //#endregion
}
