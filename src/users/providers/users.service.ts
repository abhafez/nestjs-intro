import {Inject, Injectable} from '@nestjs/common';
import {GetUserParamsDto} from '../dto/create-user/get-user-params.dto';
import {AuthService} from '../../auth/auth.service';
import {Repository} from 'typeorm';
import {User} from '../user.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {CreateUserDto} from '../dto/create-user/create-user.dto';

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

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //#region createUser
  /**
   * Creates a new user, or returns `null` if a user with the same email already exists.
   * @param createUserDto data for the new user
   */
  public async createUser(createUserDto: CreateUserDto) {
    // if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    // handle exceptions
    if (existingUser) {
      return null;
    }
    // create a new user
    let newUser = this.userRepository.create(createUserDto);
    // save to database
    newUser = await this.userRepository.save(newUser);

    return newUser;
  }
  //#endregion

  //#region finaAll
  /**
   * Finds a single user by id if `getUserParamDto.id` is set, otherwise
   * lists users page by page.
   * @param getUserParamDto route params, optionally carrying a single user id
   * @param limit page size
   * @param page page number
   */
  public findAll(getUserParamDto: GetUserParamsDto, limit: number, page: number) {
    console.log(getUserParamDto, limit, page);
    return [
      {
        firstName: 'john',
        email: 'john@doe.com',
      },
      {
        firstName: 'Alice',
        email: 'Alice@wonderland.com',
      },
    ];
  }
  //#endregion

  //#region findOneById
  /**
   * Finds a single user by id.
   * @param id user id
   */
  public async findOneById(id: number) {
    return await this.userRepository.findOneBy({id});
  }
  //#endregion
}
