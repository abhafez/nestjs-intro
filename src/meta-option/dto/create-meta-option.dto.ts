import { IsString } from 'class-validator';

/** Payload for creating a meta option. */
export class CreateMetaOptionDto {
  @IsString()
  metaValue: string;
}
