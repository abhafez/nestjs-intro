/** The payload carried by an access token, as attached to the request by the guard. */
export interface ActiveUserData {
  /** The id of the user, held in the standard JWT `sub` claim. */
  sub: number;

  /** The user's email address. */
  email: string;
}
