import { IntersectionType } from '@nestjs/swagger';
import { GetUsersBaseDto } from './get-users-base.dto';
import { PaginationQueryDto } from '../../common/pagination/dto/pagination-query.dto';

/** Query params for listing users: filters plus pagination. */
export class GetUsersDto extends IntersectionType(GetUsersBaseDto, PaginationQueryDto) {}
