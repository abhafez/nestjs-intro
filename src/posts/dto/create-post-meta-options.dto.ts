import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/** A single arbitrary key/value pair attached to a post. */
export class CreatePostMetaOptionsDto {
  /** Meta option key. */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  /** Meta option value; shape is caller-defined. */
  @ApiProperty()
  @IsNotEmpty()
  value: any;
}
