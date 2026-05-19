---
name: create-api-service
description: "Use when: create API service, generate NestJS service, CRUD service, DTO-based service, EntityService, TypeORM repository, tenant validation, HTTP_ERROR_MESSAGES, andWhereMultipleColumns query builder filters."
argument-hint: "create api service <DomainName> (with details: entity, DTOs, relations, tenant, files)"
---

# Create API Service (NestJS)

## When to Use
- Generate a new NestJS service with CRUD methods and DTOs
- Follow existing API conventions for validation, errors, and responses
- Mirror patterns from current services (products/categories)

## Inputs to Gather
- Domain name (singular, PascalCase) and module path
- Entity class and repository tokens
- DTOs: create, update, response (or full)
- Response DTOs for create/update (default responses)
- Relations (e.g., categories, tenant) and lookup rules
- Search strategy: manual query builder filters or `andWhereMultipleColumns`
- File handling (S3 upload, file info mapping) if required

## Procedure
1. Create the service class and implement `EntityService<RespDTO, CreateDTO, UpdateDTO>`.
2. Inject repositories and dependencies via constructor:
   - `@InjectRepository(Entity)` + any related entities
   - Optional `S3FilesService` when files are involved
3. Add a private finder (if needed) for uniqueness or update checks.
4. Implement `findAll`:
   - Use `createQueryBuilder`.
   - Prefer `andWhereMultipleColumns` with `getQueriesParameters` over manual `andWhere` chains.
   - Example:
     ```ts
     const queryBuilder = this._entityRepository.createQueryBuilder("entity");
     const queriesParameters = getQueriesParameters();
     queryBuilder.andWhereMultipleColumns(params, queriesParameters);
     ```
   - Load relation ids when needed.
   - Map results to response DTOs (use factory if available).
   - Add `image` or file metadata using `S3FilesService.getFileInfoByS3FileKey` when relevant.
5. Implement `create`:
   - Check for duplicates and throw `HTTP_ERROR_MESSAGES.alreadyExists()`.
   - Resolve relation ids with `Repository.findBy({ id: In(ids) })`.
   - Validate tenant existence and throw `HTTP_ERROR_MESSAGES.tenantNotFound()`.
   - Create entity, assign relations, upload file (optional), then save.
   - Return `{ id: created.id }`.
6. Implement `update`:
   - Load existing entity; if missing, throw `HTTP_ERROR_MESSAGES.notFound()`.
   - Merge changes, refresh relations, upload/replace files if needed.
   - Save and return `{ id: entity.id }`.
7. Implement `delete` and `hardDelete`:
   - Validate ids exist before delete.
   - Use `softDelete` and `delete` with `In(ids)`.
   - Return `{ ids }`.
   - Avoid `forEach(async ...)`; prefer `for...of` with `await` when validating.

## Quality Checks
- Uses `HTTP_ERROR_MESSAGES` and correct `HttpStatus` codes
- Returns default response DTO shapes for create/update/delete
- Uses repository merge and TypeORM patterns consistently
- Tenant validation is enforced when `tenantId` is part of DTO
- Files are uploaded and returned consistently if in the domain

## Reference Implementations
- [products.service.ts](./assets/products.service.ts)
- [categories.service.ts](./assets/categories.service.ts)
