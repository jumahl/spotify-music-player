export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function getError(error: unknown) {
  const message = getErrorMessage(error);
  console.log("Error:", message);
  return message;
}
