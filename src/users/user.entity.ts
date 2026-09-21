import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../posts/post.entity';

/** A registered user account. */
@Entity()
export class User {
  /** Primary key. */
  @ApiProperty({ description: 'Primary key.', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  /** Given name. */
  @ApiProperty({ description: "User's first name.", example: 'Abdurrahman' })
  @Column()
  firstName: string;

  /** Family name. */
  @ApiProperty({ description: "User's last name.", example: 'Hafez' })
  @Column()
  lastName: string;

  /** Unique email address, used to log in. */
  @ApiProperty({ description: 'Unique email address, used to log in.', example: 'user@example.com' })
  @Column()
  email: string;

  /**
   * Hashed password.
   *
   * Deliberately has no `@ApiProperty`: it must never appear in a documented response.
   */
  @Column()
  password: string;

  /** Posts authored by this user. */
  @ApiProperty({ description: 'Posts authored by this user.', type: () => [Post] })
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
