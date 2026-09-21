import { CreatePostDto } from './create-post.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/** All {@link CreatePostDto} fields made optional, plus the id of the post to update. */
export class PatchPostDto extends PartialType(CreatePostDto) {
  /** Id of the post being updated. */
  @ApiProperty({
    description: 'Id of the post being updated. Must match the `id` in the path.',
    example: '1',
  })
  @IsNotEmpty()
  id: string;
}
