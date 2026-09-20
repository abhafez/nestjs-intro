import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../posts/post.entity';

/** A registered user account. */
@Entity()
export class User {
  /** Primary key. */
  @PrimaryGeneratedColumn()
  id: number;

  /** Given name. */
  @Column()
  firstName: string;

  /** Family name. */
  @Column()
  lastName: string;

  /** Unique email address, used to log in. */
  @Column()
  email: string;

  /** Hashed password. */
  @Column()
  password: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
