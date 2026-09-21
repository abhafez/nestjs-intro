import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

/** bcrypt-backed implementation of {@link HashingProvider}. */
@Injectable()
export class BcryptProvider implements HashingProvider {
  /**
   * Hashes a plain-text password with a freshly generated salt.
   * @param password the plain-text password
   * @returns the bcrypt hash, salt included
   */
  public async hashPassword(password: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(password, salt);
  }

  /**
   * Checks a plain-text password against a stored bcrypt hash.
   * @param password the plain-text password supplied by the client
   * @param encryptedPassword the hash stored for the user
   * @returns `true` when the password matches
   */
  comparePassword(password: string | Buffer, encryptedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, encryptedPassword);
  }
}
