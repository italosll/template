/** HTTP methods that trigger audit logging. */
export const AUDITED_HTTP_METHODS: ReadonlySet<string> = new Set([
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);

/**
 * Metadata keys that must never be persisted (LGPD).
 * Matched case-insensitively at any depth of the metadata object.
 */
export const AUDIT_BANNED_METADATA_KEYS: ReadonlySet<string> = new Set(
  [
    // credentials
    "password",
    "passwordConfirmation",
    "currentPassword",
    "newPassword",
    // tokens / session
    "accessToken",
    "refreshToken",
    "token",
    "authorization",
    "cookie",
    "cookies",
    // secrets
    "secret",
    "clientSecret",
    "apiKey",
    "privateKey",
    // payment
    "creditCard",
    "cardNumber",
    "cvv",
    "cvc",
  ].map((key) => key.toLowerCase())
);

/**
 * Metadata keys kept in the audit log but encrypted at rest (LGPD).
 * Matched case-insensitively at any depth of the metadata object.
 * Mirrors the fields the platform already encrypts on User.
 */
export const AUDIT_ENCRYPT_METADATA_KEYS: ReadonlySet<string> = new Set(
  ["email", "phoneNumber"].map((key) => key.toLowerCase())
);

/** Global route prefix configured in main.ts, stripped when parsing resources. */
export const API_GLOBAL_PREFIX = "api";
