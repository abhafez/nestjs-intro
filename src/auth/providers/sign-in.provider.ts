import { Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { SignInDto } from '../dto/signInDto';

@Injectable()
export class SignInProvider {
  constructor(
    // Injecting UserService
    private readonly usersService: UsersService,

    /**
     * Inject the hashingProvider
     */
    private readonly hashingProvider: HashingProvider,
  ) {}

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
