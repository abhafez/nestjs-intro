import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Post } from '../../posts/post.entity';

/** An arbitrary JSON metadata entry. */
@Entity()
export class MetaOption {
  /** Primary key. */
  @PrimaryGeneratedColumn()
  id: number;

  /** JSON-encoded value. */
  @Column({
    type: 'json',
    nullable: false,
  })
  metaValue: string;

  /** Timestamp the meta option was created. */
  @CreateDateColumn()
  createDate: Date;

  /** Timestamp the meta option was last updated. */
  @UpdateDateColumn()
  updateDate: Date;

  @OneToOne(() => Post, (post) => post.metaOptions, {
    onDelete: 'CASCADE',
  })
  post: Post;
}
