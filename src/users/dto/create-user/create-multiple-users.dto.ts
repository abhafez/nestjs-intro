import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

/** Payload for creating multiple users in a single transaction. */
export class CreateMultipleUsersDto {
  @ApiProperty({
    description: 'Users to insert. The whole batch is written in one transaction - if any row fails, none are kept.',
    type: [CreateUserDto],
    minItems: 1,
  })
  /** The batch of users to create. */
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  users: CreateUserDto[];
}
