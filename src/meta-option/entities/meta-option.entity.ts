import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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
}
