import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateMultipleUsersDto } from '../dto/create-user/create-multiple-users.dto';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';

/** Inserts a batch of users inside a single transaction. */
@Injectable()
export class CreateMultipleUsersProvider {
  /**
   * Creates the provider.
   * @param dataSource used to open a query runner for the transaction
   */
  constructor(
    /**
     * Inject the datasource
     */
    private dataSource: DataSource,
  ) {}

  /**
   * Creates every user in the batch inside one transaction: if a single row fails,
   * the whole batch is rolled back.
   * @param createManyUsersDto the batch of users to insert
   * @returns the users that were created
   * @throws RequestTimeoutException when the database cannot be reached or the query runner cannot be released
   * @throws ConflictException when any row fails and the transaction is rolled back
   */
  public async createBulkUsers(createManyUsersDto: CreateMultipleUsersDto) {
    let newUsers: User[] = [];

    // Create Query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // Connect the query runner to the datasource
      await queryRunner.connect();
      // Start the transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException('Could not connect to the database');
    }

    try {
      for (let user of createManyUsersDto.users) {
        let newUser = queryRunner.manager.create(User, user);
        let result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
    } finally {
      try {
        // you need to release a queryRunner which was manually instantiated
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException('Could not release the query runner connection');
      } finally {
      }
    }

    return newUsers;
  }
}
