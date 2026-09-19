import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tag.dto';

/** All {@link CreateTagDto} fields made optional, for partial updates. */
export class UpdateTagDto extends PartialType(CreateTagDto) {}
