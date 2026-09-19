import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from 'class-validator';

/** Payload for creating a tag. */
export class CreateTagDto {
  /** Display name, 3-256 characters. */
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(256)
  name: string;

  /** URL-friendly identifier, e.g. `my-url`. */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  @MaxLength(512)
  slug: string;

  /** Human-readable description. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  /** Additional structured data, JSON-encoded. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON()
  schema: string;

  /** URL of the tag's featured image. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImage: string;
}
