import { Injectable } from '@nestjs/common';

/**
 * Abstract contract for password hashing.
 *
 * Injected by token so the concrete algorithm ({@link BcryptProvider}) can be swapped
 * without touching any consumer.
 */
@Injectable()
export abstract class HashingProvider {
  /**
   * Hashes a plain-text password.
   * @param password the plain-text password
   * @returns the hashed password, salt included
   */
  abstract hashPassword(password: string | Buffer): Promise<string>;

  /**
   * Checks a plain-text password against a stored hash.
   * @param password the plain-text password supplied by the client
   * @param encryptedPassword the hash stored for the user
   * @returns `true` when the password matches
   */
  abstract comparePassword(password: string | Buffer, encryptedPassword: string): Promise<boolean>;
}
