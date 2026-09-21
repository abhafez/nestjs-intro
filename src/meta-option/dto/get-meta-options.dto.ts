import { IntersectionType } from '@nestjs/swagger';
import { GetMetaOptionsBaseDto } from './get-meta-options-base.dto';
import { PaginationQueryDto } from '../../common/pagination/dto/pagination-query.dto';

/** Query params for listing meta options: date-range filters plus pagination. */
export class GetMetaOptionsDto extends IntersectionType(GetMetaOptionsBaseDto, PaginationQueryDto) {}
