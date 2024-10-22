import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { RolePermissions } from 'src/role/entities/role-permission.entity';

@Entity()
export class Permissions {
  @PrimaryColumn({ name: 'permission_id', type: 'int' })
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => RolePermissions, (role) => role.permission)
  roles: RolePermissions[];
}
