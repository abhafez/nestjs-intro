/**
 * A page of results together with its metadata and navigation links.
 *
 * @typeParam T the type of the items in the page
 */
export interface Paginated<T> {
  /** The items on the current page. */
  data: T[];
  /** Counters describing where the current page sits in the full result set. */
  meta: {
    /** How many items a full page holds. */
    itemsPerPage: number;
    /** Total number of items across every page. */
    totalItems: number;
    /** 1-based index of the current page. */
    currentPage: number;
    /** Total number of pages. */
    totalPages: number;
  };
  /** Absolute URLs for navigating the result set. */
  links: {
    /** URL of the first page. */
    first: string;
    /** URL of the last page. */
    last: string;
    /** URL of the current page. */
    current: string;
    /** URL of the next page, empty on the last page. */
    next: string;
    /** URL of the previous page, empty on the first page. */
    previous: string;
  };
}
