import { IntersectionType } from '@nestjs/swagger';
import { GetPostsBaseDto } from './get-posts-base.dto';
import { PaginationQueryDto } from '../../common/pagination/dto/pagination-query.dto';

/** Query params for listing posts: date-range filters plus pagination. */
export class GetPostsDto extends IntersectionType(GetPostsBaseDto, PaginationQueryDto) {}
