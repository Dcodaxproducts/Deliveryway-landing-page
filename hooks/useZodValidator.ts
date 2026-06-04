import type { ZodSchema } from "zod";

type ValidationResult =
  | {
      errors: Record<string, string>;
      success: false;
    }
  | {
      errors: Record<string, never>;
      success: true;
    };

export function validateZod<T>(
  schema: ZodSchema<T>,
  data: unknown,
  prefix?: string
): ValidationResult {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, errors: {} };
  }

  const formattedErrors: Record<string, string> = {};

  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    const key = prefix ? `${prefix}.${path}` : path;
    formattedErrors[key] = issue.message;
  });

  return { success: false, errors: formattedErrors };
}
