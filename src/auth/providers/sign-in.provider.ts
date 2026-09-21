import { Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { SignInDto } from '../dto/signInDto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../jwt.config';
import { type ConfigType } from '@nestjs/config';

/** Authenticates a user from an email/password pair. */
@Injectable()
export class SignInProvider {
  /**
   * Creates the provider.
   * @param usersService used to look the user up by email
   * @param hashingProvider used to compare the supplied password with the stored hash
   * @param jwtService
   * @param jwtConfiguration
   */
  constructor(
    // Injecting UserService
    private readonly usersService: UsersService,

    /**
     * Inject the hashingProvider
     */
    private readonly hashingProvider: HashingProvider,

    /** Inject JWT service */
    private readonly jwtService: JwtService,

    /** Inject JWT Config */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
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

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTTL,
        audience: this.jwtConfiguration.audience,
      },
    );

    return { token: accessToken };
  }
}
