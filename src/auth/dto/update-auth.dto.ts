import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';

/** All {@link CreateAuthDto} fields made optional, for partial updates. */
export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
