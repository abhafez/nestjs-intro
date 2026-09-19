import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePostMetaOptionsDto } from './create-post-meta-options.dto';
import { postStatus } from '../enums/post-status.enum';
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
  postType: string;

  /** URL-friendly identifier, e.g. `my-url`. */
  @ApiProperty({ example: 'my-url', description: 'Lowercase letters and "-" only, no spaces' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  slug: string;

  /** Publication status. */
  @ApiProperty({ enum: postStatus })
  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;

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
  @ApiPropertyOptional({ type: [String], minLength: 3 })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags: string[];

  /** Arbitrary key/value metadata for the post. */
  @ApiPropertyOptional({ type: [CreatePostMetaOptionsDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions: CreatePostMetaOptionsDto[];
}
