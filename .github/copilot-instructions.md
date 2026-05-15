# Copilot Instructions: API Architecture (NestJS in Nx)

This document provides a detailed, project-specific reference for the API app. Use it to align answers with the existing architecture, patterns, naming conventions, and code style.

## Workspace Context
- This is an Nx monorepo with:
  - `apps/api` (NestJS backend)
  - `apps/client` (Angular frontend)
  - `libs/interfaces` (shared TypeScript contracts)
- Source code for the API is under `apps/api/src/app`.

## Bootstrap and Global Behavior
- Entry point is `apps/api/src/main.ts`.
- Global behaviors:
  - Express JSON body limit set to 25mb.
  - Cookie parsing enabled.
  - ValidationPipe enabled globally with implicit conversion.
  - Swagger UI configured and exposed at `/api`.
  - Global prefix is `api`.

## Module Composition
- Root module: `apps/api/src/app/app.module.ts`.
- Modules currently wired:
  - UsersModule
  - ProductsModule
  - CategoriesModule
  - IamModule
  - PersonModule
- ConfigModule loads:
  - database config from `apps/api/src/app/core/config/database.config.ts`
  - s3 config from `apps/api/src/app/common/config/s3-files.config.ts`
- TypeORM is configured via `forRootAsync` and uses:
  - MySQL
  - `autoLoadEntities: true`
  - `synchronize: true` (must be disabled in production)

## Folder and Module Structure
Each domain module follows a consistent pattern:
- `module.ts`: NestJS module wiring
- `controller.ts`: HTTP routes
- `service.ts`: business logic
- `dto/`: request and response DTOs
- `entities/`: TypeORM entities
- `factories/`: DTO mapping and test data
- `utils/`: query helpers or domain utilities

Example domains:
- categories
- products
- users
- iam (auth)
- person

## Shared Contracts and Aliases
- Shared interfaces live in `libs/interfaces/src/lib`.
- Aliases are defined in `tsconfig.base.json`:
  - `@api/*` for backend modules
  - `@interfaces/*` for shared contracts

Use these aliases in imports for consistency.

## Entities and Audit Base
- Entities are TypeORM classes under each domain `entities/` folder.
- Most entities extend `Audit`, a base class in `apps/api/src/app/common/utils/audit.util.ts`.
- Audit fields include:
  - `createdAt`, `updatedAt`, `deletedAt`, `recoveredAt`
- `recoveredAt` is set automatically on recover via `@BeforeRecover`.

## DTOs and Validation
- DTOs are plain classes decorated with class-validator.
- Update DTOs often extend create DTOs and add `id`.
- Response DTOs are used instead of returning entities directly.
- Examples:
  - `CreateCategoryDTO`, `UpdateCategoryDTO`, `FullCategoryDTO`
  - `ResponseProductDTO`
  - `responseUserDTO` (note lowercase name)

## CRUD Service Pattern
Several services implement a shared contract:
- `EntityService` in `apps/api/src/app/common/services/entity.service.ts`.
- Typical service methods:
  - `findAll`
  - `create`
  - `update`
  - `delete`
  - `hardDelete`

### Error Handling
- Duplicates and missing records throw `HttpException` with:
  - `HTTP_ERROR_MESSAGES.alreadyExists()`
  - `HTTP_ERROR_MESSAGES.notFound()`
- Messages are centralized in `apps/api/src/app/common/utils/http-error-messages.util.ts`.

## Querying and Filtering
Two approaches appear:
1) Manual QueryBuilder clauses (categories)
2) Shared multi-column search helper (products/person)

### QueryBuilder Extension
- `SelectQueryBuilder` is extended in `apps/api/src/app/common/extended/select-query-builder.extended.ts`.
- The method `andWhereMultipleColumns` supports:
  - `id` search
  - `textToSearch` search across multiple columns

### Column Definitions
- Each domain can define a list of queryable columns in `utils/get-queries-parameters.util.ts`.
- These lists are consumed by `andWhereMultipleColumns`.

## Factories and Response Mapping
- Factories map entity data to DTOs and can inject fake data.
- Uses `plainToInstance` from `class-transformer`.
- Examples:
  - `ProductFactory`
  - `UserFactory`

## Users: Encryption and Hashing
- User entity stores encrypted fields and hash-protected password.
- `User.encrypt` and `User.decrypt` perform encryption/decryption logic.
- Encryption is provided by `EncryptionService` (bound to `CryptoService`).
- Hashing is provided by `HashingService` (bound to `BcryptService`).

## Files and Storage
- Abstracted behind `S3FilesService`.
- Implementation is injected via `CommonModule`.
- S3 configuration is loaded from environment variables and registered via ConfigModule.

## IAM and Authentication
- IAM module configures:
  - JWT with ConfigModule
  - `AuthenticationGuard` as a global guard
  - `AccesTokenGuard` for access token validation
  - `RefreshTokensMiddleware` applied to all routes except `/authentication`
- Auth endpoints live under `apps/api/src/app/iam/authentication`.
- Cookies are set for access and refresh tokens on sign-in.

## Controller Conventions
- Most controllers expose CRUD routes:
  - `POST /resource`
  - `GET /resource`
  - `PUT` or `PATCH /resource`
  - `DELETE /resource`
  - `DELETE /resource/hardDelete`
- Some controllers apply ValidationPipe at method level even though a global pipe exists.

## Response Shapes
- Create/Update returns `{ id: number }`.
- Delete/HardDelete returns `{ ids: number[] }`.
- List endpoints return response DTO arrays.

## Practical Guidance for Copilot
When answering or generating code for this API:
- Prefer NestJS module structure aligned to existing domains.
- Use DTO classes with class-validator and class-transformer.
- Use shared contracts from `libs/interfaces`.
- Use TypeORM repositories and QueryBuilder patterns already in the codebase.
- Follow error handling patterns and return standardized response DTOs.
- Favor dependency injection of services and repositories.
- Use `CommonModule` for shared services (encryption, S3).
- Keep naming conventions consistent (DTO suffixes, module/service/controller filenames).

## Suggested Improvement Areas (Do Not Auto-Apply)
These are architectural observations that should only be applied if explicitly requested:
- `synchronize: true` should be disabled in production.
- Some methods use `forEach(async ...)` for validation; prefer `for...of` with `await`.
- Some controllers mix `PUT` and `PATCH` for update semantics.
- Response DTO naming uses both `ResponseXDTO` and `responseUserDTO`.
