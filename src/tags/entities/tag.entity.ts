import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Post } from '../../posts/post.entity';

/** A tag that can be attached to posts. */
@Entity()
export class Tag {
  /** Primary key. */
  @ApiProperty({ description: 'Primary key.', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  /** Display name. */
  @ApiProperty({ description: 'Display name, unique across tags.', example: 'NestJS', maxLength: 256 })
  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  name: string;

  /** URL-friendly unique identifier. */
  @ApiProperty({ description: 'URL-friendly unique identifier.', example: 'nestjs', maxLength: 512 })
  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
    unique: true,
  })
  slug: string;

  /** Human-readable description. */
  @ApiPropertyOptional({
    description: 'Human-readable description.',
    example: 'Posts about the NestJS framework.',
    nullable: true,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  /** JSON-LD schema markup for the tag. */
  @ApiPropertyOptional({
    description: 'JSON-LD schema markup, stored as a JSON-encoded string.',
    example: '{"@context":"https://schema.org","@type":"Thing"}',
    nullable: true,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  schema: string;

  /** URL of the featured image. */
  @ApiPropertyOptional({
    description: "URL of the tag's featured image.",
    example: 'https://example.com/images/nestjs.png',
    maxLength: 1024,
    nullable: true,
  })
  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImage: string;

  // https://orkhan.gitbook.io/typeorm/docs/decorator-reference
  /** Timestamp the tag was created. */
  @ApiProperty({
    description: 'Timestamp the tag was created.',
    example: '2026-09-21T09:54:00.000Z',
    format: 'date-time',
  })
  @CreateDateColumn()
  createDate: Date;

  /** Timestamp the tag was last updated. */
  @ApiProperty({
    description: 'Timestamp the tag was last updated.',
    example: '2026-09-21T10:12:00.000Z',
    format: 'date-time',
  })
  @UpdateDateColumn()
  updateDate: Date;

  // Add this decorator and column enables soft delete
  /** Timestamp the tag was soft-deleted, if any. */
  @ApiPropertyOptional({
    description: 'Timestamp the tag was soft-deleted; null while the tag is active.',
    example: null,
    format: 'date-time',
    nullable: true,
  })
  @DeleteDateColumn()
  deletedAt: Date;

  /** Many-to-many relationship with posts */
  @ApiProperty({ description: 'Posts carrying this tag.', type: () => [Post] })
  @ManyToMany(() => Post, (post) => post.tags, { onDelete: 'CASCADE' })
  posts: Post[];
}
