import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostType } from './enums/post-type.enum';
import { PostStatus } from './enums/post-status.enum';
import { MetaOption } from '../meta-option/entities/meta-option.entity';
import { User } from '../users/user.entity';
import { Tag } from '../tags/entities/tag.entity';

/** A blog post, page, or another content item. */
@Entity()
export class Post {
  /** Primary key. */
  @PrimaryGeneratedColumn()
  id: number;

  /** Display title. */
  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  /** Kind of content this post represents. */
  @Column({
    type: 'enum',
    enum: PostType,
    nullable: false,
    default: PostType.POST,
  })
  postType: PostType;

  /** URL-friendly unique identifier. */
  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  /** Publication status. */
  @Column({
    type: 'enum',
    enum: PostStatus,
    nullable: false,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  /** Body content. */
  @Column({
    type: 'text',
    nullable: true,
  })
  content?: string;

  /** JSON-LD schema markup for the post. */
  @Column({
    type: 'text',
    nullable: true,
  })
  schema?: string;

  /** URL of the featured image. */
  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImageUrl?: string;

  /** Date/time the post should go live. */
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishOn?: Date;

  @ManyToOne(() => User, (user) => user.posts, {
    eager: true,
  })
  author: User;

  // Work on these in lecture on relationships
  /** Tags associated with the post. */
  @ManyToMany(() => Tag, { eager: true })
  @JoinTable()
  tags?: Tag[];

  /** Arbitrary metadata entries attached to the post. */
  @OneToOne(() => MetaOption, (metaOption) => metaOption.post, { cascade: true, eager: true })
  @JoinColumn()
  metaOptions?: MetaOption;
}
