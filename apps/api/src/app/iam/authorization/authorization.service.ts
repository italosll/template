import { Injectable, Logger } from "@nestjs/common";
import { CacheService } from "@api/common/cache/cache.service";
import { AuthorizationRepository } from "./authorization.repository";
import {
  PERMISSIONS_CACHE_TTL_SECONDS,
  permissionsCacheKey,
  permissionsCacheUserPattern,
} from "./authorization.constants";

@Injectable()
export class AuthorizationService {
  private readonly _logger = new Logger(AuthorizationService.name);

  constructor(
    private readonly _authorizationRepository: AuthorizationRepository,
    private readonly _cacheService: CacheService
  ) {}

  /**
   * Checks whether a user has a permission in the given tenant context.
   * Uses Redis cache; falls back to DB on miss and populates the cache.
   */
  async hasPermission(
    userId: number,
    tenantId: number,
    permissionCode: string
  ): Promise<boolean> {
    const permissions = await this.getEffectivePermissions(userId, tenantId);
    return permissions.has(permissionCode);
  }

  /**
   * Returns the effective permission set for a user in a tenant.
   */
  async getEffectivePermissions(
    userId: number,
    tenantId: number
  ): Promise<Set<string>> {
    const cacheKey = permissionsCacheKey(userId, tenantId);

    try {
      const cached = await this._cacheService.exists(cacheKey);
      if (cached) {
        const members = await this._cacheService.getSetMembers(cacheKey);
        return new Set(members);
      }
    } catch (error) {
      this._logger.warn(
        `Cache read failed for ${cacheKey}, falling back to database`,
        error instanceof Error ? error.stack : undefined
      );
    }

    const codes =
      await this._authorizationRepository.resolveEffectivePermissionCodes(
        userId,
        tenantId
      );

    try {
      await this._cacheService.addToSet(
        cacheKey,
        codes,
        PERMISSIONS_CACHE_TTL_SECONDS
      );
    } catch (error) {
      this._logger.warn(
        `Cache write failed for ${cacheKey}`,
        error instanceof Error ? error.stack : undefined
      );
    }

    return new Set(codes);
  }

  /** Invalidate a specific user+tenant cache entry. */
  async invalidateUserTenantCache(
    userId: number,
    tenantId: number
  ): Promise<void> {
    const key = permissionsCacheKey(userId, tenantId);
    try {
      await this._cacheService.delete(key);
    } catch (error) {
      this._logger.warn(
        `Failed to invalidate cache key ${key}`,
        error instanceof Error ? error.stack : undefined
      );
    }
  }

  /**
   * Invalidate all tenant caches for a user (used when GLOBAL assignments change).
   */
  async invalidateUserCache(userId: number): Promise<void> {
    const pattern = permissionsCacheUserPattern(userId);
    try {
      await this._cacheService.deleteByPattern(pattern);
    } catch (error) {
      this._logger.warn(
        `Failed to invalidate cache pattern ${pattern}`,
        error instanceof Error ? error.stack : undefined
      );
    }
  }

  /**
   * Invalidate caches for every user that has the given role.
   * Used when a role gains or loses permissions.
   */
  async invalidateRoleCache(roleId: number): Promise<void> {
    const userIds =
      await this._authorizationRepository.findUserIdsByRoleId(roleId);

    await Promise.all(userIds.map((userId) => this.invalidateUserCache(userId)));
  }
}
