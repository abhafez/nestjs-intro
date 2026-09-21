import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from 'class-validator';

/** Payload for creating a tag. */
export class CreateTagDto {
  /** Display name, 3-256 characters. */
  @ApiProperty({
    description: 'Display name. Must be unique across tags.',
    example: 'NestJS',
    minLength: 3,
    maxLength: 256,
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(256)
  name: string;

  /** URL-friendly identifier, e.g. `my-url`. */
  @ApiProperty({
    description: 'URL-friendly identifier: lowercase letters, digits and "-" only, no spaces. Must be unique.',
    example: 'nestjs',
    maxLength: 512,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  @MaxLength(512)
  slug: string;

  /** Human-readable description. */
  @ApiPropertyOptional({
    description: 'Human-readable description of the tag.',
    example: 'Posts about the NestJS framework.',
  })
  @IsOptional()
  @IsString()
  description: string;

  /** Additional structured data, JSON-encoded. */
  @ApiPropertyOptional({
    description: 'Additional structured data as a JSON-encoded string.',
    example: '{"@context":"https://schema.org","@type":"Thing"}',
  })
  @IsOptional()
  @IsJSON()
  schema: string;

  /** URL of the tag's featured image. */
  @ApiPropertyOptional({
    description: "URL of the tag's featured image.",
    example: 'https://example.com/images/nestjs.png',
    maxLength: 1024,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImage: string;
}
