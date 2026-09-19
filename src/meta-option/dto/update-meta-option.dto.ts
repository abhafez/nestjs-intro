import { PartialType } from '@nestjs/swagger';
import { CreateMetaOptionDto } from './create-meta-option.dto';

/** Payload for updating a meta option; all fields optional. */
export class UpdateMetaOptionDto extends PartialType(CreateMetaOptionDto) {}
