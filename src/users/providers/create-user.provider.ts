import { ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common';

import { User } from '../user.entity';
import { handleDatabaseError } from '../../app/database/database-error.handler';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user/create-user.dto';
import { HashingProvider } from '../../auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
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
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: await this.hashingProvider.hashPassword(createUserDto.password),
      });

      return await this.userRepository.save(newUser);
    } catch (error) {
      handleDatabaseError(error, 'creating the user');
    }
  }
}
