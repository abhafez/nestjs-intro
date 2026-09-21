/** How a route authenticates the caller. */
export enum AuthType {
  /** Requires a valid `Authorization: Bearer <token>` header. */
  Bearer,
  /** Public: no authentication at all. */
  None,
}
