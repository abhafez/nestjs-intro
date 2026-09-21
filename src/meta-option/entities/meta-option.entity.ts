import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../posts/post.entity';

/** An arbitrary JSON metadata entry. */
@Entity()
export class MetaOption {
  /** Primary key. */
  @ApiProperty({ description: 'Primary key.', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  /** JSON-encoded value. */
  @ApiProperty({
    description: 'Arbitrary metadata value, stored as JSON.',
    example: 'elit quis labore tempor eiusmod',
  })
  @Column({
    type: 'json',
    nullable: false,
  })
  metaValue: string;

  /** Timestamp the meta option was created. */
  @ApiProperty({
    description: 'Timestamp the meta option was created.',
    example: '2026-09-21T09:54:00.000Z',
    format: 'date-time',
  })
  @CreateDateColumn()
  createDate: Date;

  /** Timestamp the meta option was last updated. */
  @ApiProperty({
    description: 'Timestamp the meta option was last updated.',
    example: '2026-09-21T10:12:00.000Z',
    format: 'date-time',
  })
  @UpdateDateColumn()
  updateDate: Date;

  /** Post this meta option belongs to. */
  @ApiProperty({ description: 'Post this meta option belongs to.', type: () => Post })
  @OneToOne(() => Post, (post) => post.metaOptions, {
    onDelete: 'CASCADE',
  })
  post: Post;
}
