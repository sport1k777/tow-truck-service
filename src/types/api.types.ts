export type ActionResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        fields?: Record<string, string>;
      };
    };

export function successResult<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function errorResult(
  code: string,
  message: string,
  fields?: Record<string, string>,
): ActionResult<never> {
  return { success: false, error: { code, message, fields } };
}
