import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../user.entity';
import { handleDatabaseError } from '../../app/database/database-error.handler';

/** Looks up a single user by arbitrary columns. */
@Injectable()
export class FindOneUserByProvider {
  /**
   * Creates the provider.
   * @param userRepository
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Finds a single user matching the given columns, e.g. `findOneBy({ email })`.
   * @param where columns to match on; every key must be satisfied
   * @throws NotFoundException when no user matches
   * @throws RequestTimeoutException when the database is unreachable
   */
  public async findOneBy(where: FindOptionsWhere<User>) {
    let user: User | null;

    try {
      user = await this.userRepository.findOneBy(where);
    } catch (error) {
      handleDatabaseError(error, 'looking up the user');
    }

    if (!user) {
      const criteria = Object.entries(where)
        .map(([column, value]) => `${column} ${String(value)}`)
        .join(' and ');

      throw new NotFoundException(`User with ${criteria} was not found.`);
    }

    return user;
  }
}
