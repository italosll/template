import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

/**
 * Immutable audit trail of write operations (POST/PUT/PATCH/DELETE).
 * Written exclusively by AuditService; never updated or soft-deleted.
 */
@Entity()
@Index(["tenantId", "createdAt"])
@Index(["tenantId", "resourceType", "resourceId"])
export class AuditLog {
  @PrimaryGeneratedColumn()
  id!: number;

  /** e.g. `POST /products` */
  @Column()
  action!: string;

  @Column({ nullable: true })
  resourceType?: string;

  @Column({ nullable: true })
  resourceId?: string;

  @Column({ nullable: true })
  userId?: number;

  /** null when the request has no tenant context (e.g. anonymous routes). */
  @Column({ nullable: true })
  tenantId?: number;

  @Column({ default: false })
  isSuperUser!: boolean;

  @Column()
  statusCode!: number;

  @Column()
  executionTimeMs!: number;

  /** Ciphertext (`iv|hex`) produced by EncryptionService; never plaintext. */
  @Column({ type: "varchar", length: 512, nullable: true })
  ipAddress?: string;

  /** Sanitized (LGPD banlist) and selectively encrypted request/response data. */
  @Column({ type: "json", nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;
}
