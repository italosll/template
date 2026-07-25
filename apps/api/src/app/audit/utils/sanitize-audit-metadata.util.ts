import {
  AUDIT_BANNED_METADATA_KEYS,
  AUDIT_ENCRYPT_METADATA_KEYS,
} from "../audit.constants";

type TransformFn = (value: string) => string;

/**
 * Returns a copy of the metadata safe to persist (LGPD):
 * - banned keys are removed at any depth;
 * - allowlisted sensitive keys have their string values encrypted.
 */
export function sanitizeAuditMetadata(
  metadata: unknown,
  encrypt: TransformFn
): unknown {
  return walk(metadata, encrypt, new WeakSet());
}

/**
 * Returns a copy of persisted metadata with the allowlisted
 * sensitive keys decrypted for authorized readers.
 */
export function decryptAuditMetadata(
  metadata: unknown,
  decrypt: TransformFn
): unknown {
  return walk(metadata, decrypt, new WeakSet(), true);
}

function walk(
  value: unknown,
  transform: TransformFn,
  seen: WeakSet<object>,
  lenient = false
): unknown {
  if (Array.isArray(value)) {
    if (seen.has(value)) {
      return undefined;
    }
    seen.add(value);
    return value.map((item) => walk(item, transform, seen, lenient));
  }

  if (value !== null && typeof value === "object") {
    if (seen.has(value)) {
      return undefined;
    }
    seen.add(value);

    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      const normalizedKey = key.toLowerCase();

      if (AUDIT_BANNED_METADATA_KEYS.has(normalizedKey)) {
        continue;
      }

      if (
        AUDIT_ENCRYPT_METADATA_KEYS.has(normalizedKey) &&
        typeof entry === "string" &&
        entry.length > 0
      ) {
        result[key] = applyTransform(entry, transform, lenient);
        continue;
      }

      result[key] = walk(entry, transform, seen, lenient);
    }
    return result;
  }

  return value;
}

/**
 * When decrypting (lenient mode), a corrupted or legacy plaintext value
 * must not break the whole listing — keep the stored value as-is.
 */
function applyTransform(
  value: string,
  transform: TransformFn,
  lenient: boolean
): string {
  if (!lenient) {
    return transform(value);
  }

  try {
    return transform(value);
  } catch {
    return value;
  }
}
