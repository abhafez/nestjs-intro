import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/** A single arbitrary key/value pair attached to a post. */
export class CreatePostMetaOptionsDto {
  /** Meta option value; shape is caller-defined. */
  @ApiProperty({
    description: 'Meta option value; shape is caller-defined and stored as JSON.',
    example: 'elit quis labore tempor eiusmod',
  })
  @IsNotEmpty()
  metaValue: string;
}
