import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiAuth } from '../auth/decorators/api-auth.decorator';
import { CreateUserDto } from './dto/create-user/create-user.dto';
import { GetUserParamsDto } from './dto/create-user/get-user-params.dto';
import { PatchUserDto } from './dto/create-user/patch-user.dto';
import { UsersService } from './providers/users.service';
import { CreateMultipleUsersDto } from './dto/create-user/create-multiple-users.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { User } from './user.entity';
import { ApiErrorResponseDto } from '../common/dto/api-error-response.dto';
import { ValidationErrorResponseDto } from '../common/dto/validation-error-response.dto';
import { MessageResponseDto } from '../common/dto/message-response.dto';

/** User CRUD routes. */
@ApiTags('Users')
@ApiServiceUnavailableResponse({
  description: 'The database was unreachable or the query failed unexpectedly.',
  type: ApiErrorResponseDto,
})
@ApiAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  //#region GET /users/:id
  /**
   * Gets a single user by id, or lists users page by page.
   * @param getUserParamsDto route params, optionally carrying a single user id
   * @param query page/limit
   */
  @ApiOperation({
    summary: 'Get a user by id',
    description:
      'Returns the single user with that id. The handler also contains a paginated list branch, but it is ' +
      'unreachable: the route is declared as `@Get(":id")`, so `GET /users` does not match and `id` is always ' +
      'present. `limit`, `page` and `email` are therefore accepted and validated but never used.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id of the user to fetch.', example: 1, required: true })
  @ApiOkResponse({ description: 'The requested user, including their posts.', type: User })
  @ApiBadRequestResponse({ description: 'The id is not an integer.', type: ValidationErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No user has that id.', type: ApiErrorResponseDto })
  @Get(':id')
  getUsers(@Param() getUserParamsDto: GetUserParamsDto, @Query() query: GetUsersDto) {
    return this.userService.findAll(getUserParamsDto, query);
  }
  //#endregion

  //#region POST /users
  /**
   * Creates a user.
   * @param createUserDto user data
   * @param i18n resolves the success message for the request's language
   */
  @ApiOperation({
    summary: 'Create a user',
    description:
      'Rejects an email that is already registered, hashes the password with bcrypt, then writes the row. ' +
      'Returns only a confirmation message - the created user is not echoed back. The message is translated ' +
      "from the request's `Accept-Language` header (`en` and `ar` available, falling back to `en`).",
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      minimal: {
        summary: 'Minimal - lastName omitted',
        value: {
          firstName: 'Abdurrahman',
          email: 'user@example.com',
          password: 'Str0ng!Passw0rd',
        },
      },
      full: {
        summary: 'Full - every field populated',
        value: {
          firstName: 'Abdurrahman',
          lastName: 'Hafez',
          email: 'user@example.com',
          password: 'Str0ng!Passw0rd',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'The user was created.', type: MessageResponseDto })
  @ApiBadRequestResponse({
    description: 'Validation failed - for example a password missing an uppercase letter, a digit or a symbol.',
    type: ValidationErrorResponseDto,
  })
  @ApiConflictResponse({ description: 'A user with that email already exists.', type: ApiErrorResponseDto })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @I18n() i18n: I18nContext) {
    await this.userService.createUser(createUserDto);

    return { message: i18n.t('messages.USER_CREATED') };
  }
  //#endregion

  //#region PATCH /user/:id
  /**
   * Updates a user.
   * @param patchUserDto fields to update
   */
  @ApiOperation({
    summary: 'Update a user',
    description:
      'Not implemented. The handler validates the body and echoes it straight back - nothing is written to the ' +
      'database, and the `id` path parameter is not read.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id of the user to update. Currently ignored.', example: 1 })
  @ApiBody({
    type: PatchUserDto,
    examples: {
      rename: { summary: 'Change the display name', value: { firstName: 'Abdurrahman', lastName: 'Hafez' } },
    },
  })
  @ApiOkResponse({ description: 'The request body, echoed back unchanged.', type: PatchUserDto })
  @ApiBadRequestResponse({ description: 'Validation failed.', type: ValidationErrorResponseDto })
  @Patch(':id')
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
  //#endregion

  //#region POST /users/add-bulk
  /**
   * Add bulk users.
   * @param createUserDtos the batch of users to insert
   */
  @ApiOperation({
    summary: 'Create several users at once',
    description:
      'Inserts the whole batch inside a single query-runner transaction: if any row fails, the transaction is ' +
      'rolled back and none are kept. The handler returns no body.',
  })
  @ApiBody({
    type: CreateMultipleUsersDto,
    examples: {
      pair: {
        summary: 'Two users in one transaction',
        value: {
          users: [
            { firstName: 'Abdurrahman', lastName: 'Hafez', email: 'first@example.com', password: 'Str0ng!Passw0rd' },
            { firstName: 'Second', lastName: 'User', email: 'second@example.com', password: 'An0ther!Pass' },
          ],
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'The batch was committed. No response body is returned.' })
  @ApiBadRequestResponse({ description: 'Validation failed for at least one user.', type: ValidationErrorResponseDto })
  @Post('add-bulk')
  public bulkCreateUsers(@Body() createUserDtos: CreateMultipleUsersDto) {
    return this.userService.bulkUsersCreate(createUserDtos);
  }
  //#endregion
}
