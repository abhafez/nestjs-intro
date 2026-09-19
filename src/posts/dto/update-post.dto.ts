import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

/** All {@link CreatePostDto} fields made optional, for partial updates. */
export class UpdatePostDto extends PartialType(CreatePostDto) {}
