import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetUserParamsDto } from '../dto/create-user/get-user-params.dto';
import { AuthService } from '../../auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user/create-user.dto';
import { handleDatabaseError } from '../../app/database/database-error.handler';
import { CreateMultipleUsersProvider } from './create-multiple-users.provider';
import { CreateMultipleUsersDto } from '../dto/create-user/create-multiple-users.dto';

/** Business logic for users. */
@Injectable()
export class UsersService {
  /**
   * Creates the service.
   * @param authService injected for future auth-aware user queries
   * @param userRepository
   */
  constructor(
    @Inject()
    private readonly authService: AuthService,

    @Inject()
    private readonly createMultipleUsersProvider: CreateMultipleUsersProvider,

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
    let existingUser: User | null;

    try {
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      handleDatabaseError(error, 'checking whether the email is already taken');
    }

    if (existingUser) {
      throw new ConflictException(`A user with the email ${createUserDto.email} already exists.`);
    }

    try {
      const newUser = this.userRepository.create(createUserDto);

      return await this.userRepository.save(newUser);
    } catch (error) {
      handleDatabaseError(error, 'creating the user');
    }
  }
  //#endregion

  //#region finaAll
  /**
   * Finds a single user by id if `getUserParamDto.id` is set, otherwise
   * lists users page by page.
   * @param getUserParamDto route params, optionally carrying a single user id
   * @param limit page size
   * @param page page number
   * @throws NotFoundException when a requested user id does not exist
   * @throws RequestTimeoutException when the database is unreachable
   */
  public async findAll(getUserParamDto: GetUserParamsDto, limit: number, page: number) {
    if (getUserParamDto.id) {
      return await this.findOneById(getUserParamDto.id);
    }

    try {
      return await this.userRepository.find({
        skip: (page - 1) * limit,
        take: limit,
      });
    } catch (error) {
      handleDatabaseError(error, 'listing users');
    }
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
    let user: User | null;

    try {
      user = await this.userRepository.findOneBy({ id });
    } catch (error) {
      handleDatabaseError(error, 'looking up the user');
    }

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found.`);
    }

    return user;
  }
  //#endregion

  //#region Bulk create user
  /**
   * Creates multiple users using query runner.
   */
  public async bulkUsersCreate(bulkUsers: CreateMultipleUsersDto) {
    this.createMultipleUsersProvider.createBulkUsers(bulkUsers);
  }
  //#endregion
}
