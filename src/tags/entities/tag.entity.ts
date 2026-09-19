import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/** A tag that can be attached to posts. */
@Entity()
export class Tag {
  /** Primary key. */
  @PrimaryGeneratedColumn()
  id: string;

  /** Display name. */
  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  name: string;

  /** URL-friendly unique identifier. */
  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
    unique: true,
  })
  slug: string;

  /** Human-readable description. */
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  /** JSON-LD schema markup for the tag. */
  @Column({
    type: 'text',
    nullable: true,
  })
  schema: string;

  /** URL of the featured image. */
  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImage: string;

  // https://orkhan.gitbook.io/typeorm/docs/decorator-reference
  /** Timestamp the tag was created. */
  @CreateDateColumn()
  createDate: Date;

  /** Timestamp the tag was last updated. */
  @UpdateDateColumn()
  updateDate: Date;

  // Add this decorartor and column enables soft delete
  /** Timestamp the tag was soft-deleted, if any. */
  @DeleteDateColumn()
  deletedAt: Date;
}
