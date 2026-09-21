import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateMultipleUsersProvider } from './providers/create-multiple-users.provider';
import { PaginationModule } from '../common/pagination/pagination.module';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneUserByProvider } from './providers/find-one-user-by.provider';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CreateMultipleUsersProvider, CreateUserProvider, FindOneUserByProvider],
  imports: [PaginationModule, forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
  exports: [UsersService],
})
export class UsersModule {}
