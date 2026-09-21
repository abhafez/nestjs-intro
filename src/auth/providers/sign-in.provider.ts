import { Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { SignInDto } from '../dto/signInDto';

/** Authenticates a user from an email/password pair. */
@Injectable()
export class SignInProvider {
  /**
   * Creates the provider.
   * @param usersService used to look the user up by email
   * @param hashingProvider used to compare the supplied password with the stored hash
   */
  constructor(
    // Injecting UserService
    private readonly usersService: UsersService,

    /**
     * Inject the hashingProvider
     */
    private readonly hashingProvider: HashingProvider,
  ) {}

  /**
   * Signs a user in.
   * @param signInDto the submitted credentials
   * @returns `true` when the credentials are valid
   * @throws NotFoundException when no user has that email
   * @throws UnauthorizedException when the password does not match
   * @throws RequestTimeoutException when the hash comparison fails
   */
  public async signIn(signInDto: SignInDto) {
    // find user by email ID
    const user = await this.usersService.findOneBy({ email: signInDto.email });
    // Throw exception if user is not found
    // Above | Taken care by the findInByEmail method

    let isEqual: boolean = false;

    try {
      // Compare the password to hash
      isEqual = await this.hashingProvider.comparePassword(signInDto.password, user.password);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare the password',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }

    // Send confirmation
    return true;
  }
}
