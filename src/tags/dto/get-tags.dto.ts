import { IntersectionType } from '@nestjs/swagger';
import { GetTagsBaseDto } from './get-tags-base.dto';
import { PaginationQueryDto } from '../../common/pagination/dto/pagination-query.dto';

/** Query params for listing tags: date-range filters plus pagination. */
export class GetTagsDto extends IntersectionType(GetTagsBaseDto, PaginationQueryDto) {}
