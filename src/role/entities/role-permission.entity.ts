import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Roles } from './roles.entity';
import { Permissions } from './permission.entity';

@Entity()
export class RolePermissions {
  @PrimaryColumn({ name: 'role_id', type: 'int' })
  roleId: number;

  @PrimaryColumn({ name: 'permission_id', type: 'int' })
  permissionId: number;

  @ManyToOne(() => Roles, (role) => role.permissions)
  role: Roles;

  @ManyToOne(() => Permissions, (permission) => permission.roles)
  permission: Permissions;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
