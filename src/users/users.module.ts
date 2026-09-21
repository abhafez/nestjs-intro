import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateMultipleUsersProvider } from './providers/create-multiple-users.provider';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CreateMultipleUsersProvider],
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
  exports: [UsersService],
})
export class UsersModule {}
