import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/** A single arbitrary key/value pair attached to a post. */
export class CreatePostMetaOptionsDto {
  /** Meta option value; shape is caller-defined. */
  @ApiProperty()
  @IsNotEmpty()
  metaValue: string;
}
