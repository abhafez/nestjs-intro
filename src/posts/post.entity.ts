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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostType } from './enums/post-type.enum';
import { PostStatus } from './enums/post-status.enum';
import { MetaOption } from '../meta-option/entities/meta-option.entity';
import { User } from '../users/user.entity';
import { Tag } from '../tags/entities/tag.entity';

/** A blog post, page, or another content item. */
@Entity()
export class Post {
  /** Primary key. */
  @ApiProperty({ description: 'Primary key.', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  /** Display title. */
  @ApiProperty({
    description: 'Display title.',
    example: 'Getting started with NestJS providers',
    maxLength: 512,
  })
  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  /** Kind of content this post represents. */
  @ApiProperty({ description: 'Kind of content this post represents.', enum: PostType, example: PostType.POST })
  @Column({
    type: 'enum',
    enum: PostType,
    nullable: false,
    default: PostType.POST,
  })
  postType: PostType;

  /** URL-friendly unique identifier. */
  @ApiProperty({
    description: 'URL-friendly unique identifier.',
    example: 'getting-started-with-nestjs-providers',
    maxLength: 256,
  })
  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  /** Publication status. */
  @ApiProperty({ description: 'Publication status.', enum: PostStatus, example: PostStatus.DRAFT })
  @Column({
    type: 'enum',
    enum: PostStatus,
    nullable: false,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  /** Body content. */
  @ApiPropertyOptional({
    description: 'Body content.',
    example: 'Providers are the backbone of dependency injection in NestJS...',
    nullable: true,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  content?: string;

  /** JSON-LD schema markup for the post. */
  @ApiPropertyOptional({
    description: 'JSON-LD schema markup, stored as a JSON-encoded string.',
    example: '{"@context":"https://schema.org","@type":"BlogPosting"}',
    nullable: true,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  schema?: string;

  /** URL of the featured image. */
  @ApiPropertyOptional({
    description: "URL of the post's featured image.",
    example: 'https://example.com/images/providers.png',
    maxLength: 1024,
    nullable: true,
  })
  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImageUrl?: string;

  /** Date/time the post should go live. */
  @ApiPropertyOptional({
    description: 'Date/time the post should go live.',
    example: '2026-10-01T08:00:00.000Z',
    format: 'date-time',
    nullable: true,
  })
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishOn?: Date;

  /** Author of the post. */
  @ApiProperty({ description: 'Author of the post.', type: () => User })
  @ManyToOne(() => User, (user) => user.posts, {
    eager: true,
  })
  author: User;

  // Work on these in lecture on relationships
  /** Tags associated with the post. */
  @ApiPropertyOptional({ description: 'Tags associated with the post.', type: () => [Tag] })
  @ManyToMany(() => Tag, (tag) => tag.posts, { eager: true })
  @JoinTable()
  tags?: Tag[];

  /** Arbitrary metadata entries attached to the post. */
  @ApiPropertyOptional({ description: 'Single meta option attached to the post.', type: () => MetaOption })
  @OneToOne(() => MetaOption, (metaOption) => metaOption.post, { cascade: true, eager: true })
  @JoinColumn()
  metaOptions?: MetaOption;
}
