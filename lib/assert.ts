export function assertOk<T>(
  value: { data: T | null; error: { message: string } | null },
  context: string
): T {
  if (value.error) {
    throw new Error(`${context} failed: ${value.error.message}`);
  }
  if (value.data === null || value.data === undefined) {
    throw new Error(`${context} returned no data`);
  }
  return value.data;
}

export function assertArray<T>(value: T[] | null | undefined, context: string): T[] {
  if (!Array.isArray(value)) {
    throw new Error(`${context} expected an array, got ${typeof value}`);
  }
  return value;
}

export function assertHasField<T extends object>(
  obj: T,
  field: keyof T,
  context: string
): void {
  if (obj[field] === undefined || obj[field] === null) {
    throw new Error(`${context}: missing required field "${String(field)}"`);
  }
}
