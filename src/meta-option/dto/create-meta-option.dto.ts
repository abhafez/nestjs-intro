import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/** Payload for creating a meta option. */
export class CreateMetaOptionDto {
  /** Metadata value, stored as JSON. */
  @ApiProperty({
    description: 'Metadata value, stored as JSON on the meta_option row.',
    example: 'elit quis labore tempor eiusmod',
  })
  @IsString()
  metaValue: string;
}
