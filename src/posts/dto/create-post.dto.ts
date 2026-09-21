import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePostMetaOptionsDto } from './create-post-meta-options.dto';
import { PostStatus } from '../enums/post-status.enum';
import { PostType } from '../enums/post-type.enum';

/** Payload for creating a post. */
export class CreatePostDto {
  /** Post title, at least 4 characters. */
  @ApiProperty({
    description: 'Post title.',
    example: 'Getting started with NestJS providers',
    minLength: 4,
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  /** Kind of content this post represents. */
  @ApiProperty({
    description: 'Kind of content this post represents.',
    enum: PostType,
    example: PostType.POST,
  })
  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;

  /** URL-friendly identifier, e.g. `my-url`. */
  @ApiProperty({
    description: 'URL-friendly identifier: lowercase letters, digits and "-" only, no spaces. Must be unique.',
    example: 'getting-started-with-nestjs-providers',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  slug: string;

  /** Publication status. */
  @ApiProperty({
    description: 'Publication status.',
    enum: PostStatus,
    example: PostStatus.DRAFT,
  })
  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;

  /** Body content. */
  @ApiPropertyOptional({
    description: 'Body content of the post.',
    example: 'Providers are the backbone of dependency injection in NestJS...',
  })
  @IsOptional()
  @IsString()
  content: string;

  /** Additional structured data, JSON-encoded. */
  @ApiPropertyOptional({
    description: 'Additional structured data as a JSON-encoded string.',
    example: '{"@context":"https://schema.org","@type":"BlogPosting"}',
  })
  @IsOptional()
  @IsJSON()
  schema: string;

  /** URL of the post's featured image. */
  @ApiPropertyOptional({
    description: "URL of the post's featured image.",
    example: 'https://example.com/images/providers.png',
  })
  @IsOptional()
  @IsUrl()
  featuredImageUrl: string;

  /** Scheduled publish date/time, ISO 8601. */
  @ApiPropertyOptional({
    description: 'Scheduled publish date/time, ISO 8601.',
    example: '2026-10-01T08:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsISO8601()
  @IsOptional()
  publishOn: Date;

  /** Tag names to associate with the post. */
  @ApiPropertyOptional({
    description: 'Ids of existing tags to attach. Every id must exist or the request is rejected.',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags: number[];

  /**
   * Arbitrary key/value metadata for the post.
   *
   * A post has exactly one meta option ({@link Post.metaOptions} is `@OneToOne`), so this
   * must be a single object. `@IsObject` rejects an array outright — without it an array
   * is transformed into a `metaValue`-less instance and cascades a null row into
   * `meta_option`.
   */
  @ApiPropertyOptional({
    description: 'Single meta option to cascade-insert with the post. An object, never an array.',
    type: CreatePostMetaOptionsDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto;

  @ApiProperty({
    description: 'Id of the user authoring the post. Must be an existing user.',
    type: 'integer',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  authorId: number;
}
