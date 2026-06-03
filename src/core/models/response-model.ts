/**
 * Standard API envelope returned by every MyBlog endpoint.
 *
 * The live API does NOT send an `isSuccess` flag and may send `failMessages: null`,
 * so success is derived from the absence of fail messages — use {@link isApiSuccess}.
 */
export interface ResponseModel<T> {
  failMessages: string[] | null;
  data: T;
}

/** A response is successful when the API reported no failure messages. */
export function isApiSuccess<T>(response: ResponseModel<T>): boolean {
  return response.failMessages === null || response.failMessages.length === 0;
}
