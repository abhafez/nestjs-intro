import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePostMetaOptionsDto } from './create-post-meta-options.dto';
import { PostStatus } from '../enums/post-status.enum';
import { PostType } from '../enums/post-type.enum';

/** Payload for creating a post. */
export class CreatePostDto {
  /** Post title, at least 4 characters. */
  @ApiProperty({ minLength: 4 })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  /** Kind of content this post represents. */
  @ApiProperty({ enum: PostType })
  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;

  /** URL-friendly identifier, e.g. `my-url`. */
  @ApiProperty({ example: 'my-url', description: 'Lowercase letters and "-" only, no spaces' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  slug: string;

  /** Publication status. */
  @ApiProperty({ enum: PostStatus })
  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;

  /** Body content. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content: string;

  /** Additional structured data, JSON-encoded. */
  @ApiPropertyOptional({ description: 'JSON-encoded string' })
  @IsOptional()
  @IsJSON()
  schema: string;

  /** URL of the post's featured image. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  featuredImageUrl: string;

  /** Scheduled publish date/time, ISO 8601. */
  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsISO8601()
  @IsOptional()
  publishOn: Date;

  /** Tag names to associate with the post. */
  @ApiPropertyOptional({
    description: 'Array of ids of tags',
    type: [Number],
    minLength: 3,
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags: number[];

  /** Arbitrary key/value metadata for the post. */
  @ApiPropertyOptional({ type: [CreatePostMetaOptionsDto], required: false })
  @IsOptional()
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions: CreatePostMetaOptionsDto;

  @ApiProperty({
    type: 'integer',
    required: true,
    example: 1223,
  })
  @IsInt()
  @IsNotEmpty()
  authorId: number;
}
