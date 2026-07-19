export abstract class CacheService {
  abstract get(key: string): Promise<string | null>;

  abstract set(key: string, value: string, ttlSeconds?: number): Promise<void>;

  abstract delete(key: string): Promise<void>;

  abstract deleteByPattern(pattern: string): Promise<void>;

  abstract exists(key: string): Promise<boolean>;

  abstract getSetMembers(key: string): Promise<string[]>;

  abstract addToSet(
    key: string,
    members: string[],
    ttlSeconds?: number
  ): Promise<void>;

  abstract isSetMember(key: string, member: string): Promise<boolean>;

  abstract deleteSet(key: string): Promise<void>;
}
