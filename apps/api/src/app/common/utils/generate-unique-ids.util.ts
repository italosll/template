export function generateUniqueId(length = 8): string {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, length + 2);

  return `${timestamp}${randomString}`;
}