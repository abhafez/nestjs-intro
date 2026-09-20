import { CreatePostDto } from './create-post.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/** All {@link CreatePostDto} fields made optional, plus the id of the post to update. */
export class PatchPostDto extends PartialType(CreatePostDto) {
  /** Id of the post being updated. */
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}
