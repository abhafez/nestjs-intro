import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
