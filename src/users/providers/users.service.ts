import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetUserParamsDto } from '../dto/create-user/get-user-params.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user/create-user.dto';
import { handleDatabaseError } from '../../app/database/database-error.handler';
import { CreateMultipleUsersProvider } from './create-multiple-users.provider';
import { CreateMultipleUsersDto } from '../dto/create-user/create-multiple-users.dto';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { GetUsersDto } from '../dto/get-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByProvider } from './find-one-user-by.provider';

/** Business logic for users. */
@Injectable()
export class UsersService {
  /**
   * Creates the service.
   * @param createUserProvider
   * @param createMultipleUsersProvider
   * @param findOneUserByProvider
   * @param paginationProvider
   * @param userRepository
   */
  constructor(
    private readonly createUserProvider: CreateUserProvider,

    @Inject()
    private readonly createMultipleUsersProvider: CreateMultipleUsersProvider,

    private readonly findOneUserByProvider: FindOneUserByProvider,

    private readonly paginationProvider: PaginationProvider,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //#region createUser
  /**
   * Creates a new user.
   * @param createUserDto data for the new user
   * @throws ConflictException when a user with the same email already exists
   * @throws RequestTimeoutException when the database is unreachable
   */
  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }
  //#endregion

  //#region finaAll
  /**
   * Finds a single user by id if `getUserParamDto.id` is set, otherwise
   * lists users page by page.
   * @param getUserParamDto route params, optionally carrying a single user id
   * @param query page/limit from the query string
   * @throws NotFoundException when a requested user id does not exist
   * @throws RequestTimeoutException when the database is unreachable
   */
  public async findAll(getUserParamDto: GetUserParamsDto, query: GetUsersDto) {
    if (getUserParamDto.id) {
      return await this.findOneById(getUserParamDto.id);
    }

    try {
      return await this.paginationProvider.paginateQuery(query, this.userRepository);
    } catch (error) {
      handleDatabaseError(error, 'listing users');
    }
  }
  //#endregion

  //#region findOneBy
  /**
   * Finds a single user matching the given columns, e.g. `findOneBy({ email })`.
   * @param where columns to match on; every key must be satisfied
   * @throws NotFoundException when no user matches
   * @throws RequestTimeoutException when the database is unreachable
   */
  public async findOneBy(where: FindOptionsWhere<User>) {
    return await this.findOneUserByProvider.findOneBy(where);
  }
  //#endregion

  //#region findOneById
  /**
   * Finds a single user by id.
   * @param id user id
   * @throws NotFoundException when no user has that id
   * @throws RequestTimeoutException when the database is unreachable
   */
  public async findOneById(id: number) {
    return await this.findOneBy({ id });
  }
  //#endregion

  //#region Bulk create user
  /**
   * Creates multiple users using query runner.
   */
  public async bulkUsersCreate(bulkUsers: CreateMultipleUsersDto) {
    await this.createMultipleUsersProvider.createBulkUsers(bulkUsers);
  }
  //#endregion
}
