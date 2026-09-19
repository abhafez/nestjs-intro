import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';
import { Tag } from '../tags/entities/tag.entity';
import { MetaOption } from '../meta-option/entities/meta-option.entity';

/** All TypeORM entities registered with the application's database connection. */
export const AppEntities = [MetaOption, Post, Tag, User];
