import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/swagger';

/** All {@link CreateUserDto} fields made optional, for partial updates. */
export class PatchUserDto extends PartialType(CreateUserDto) {}
