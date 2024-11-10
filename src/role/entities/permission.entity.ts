import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
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

  @Column()
  type: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @OneToMany(() => Permissions, (permission) => permission.parent)
  children: Permissions[];

  @ManyToOne(() => Permissions, (permission) => permission.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Permissions;
}
