import {
  Entity,
  Column,
  OneToMany,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from 'src/users/entity/users.entity';
import { AppClientsRole } from 'src/auth/entities/client_role.entity';
import { RolePermissions } from 'src/role/entities/role-permission.entity';
import { Schools } from 'src/school/entities/school.entity';

@Entity()
export class Roles {
  @PrimaryColumn({ name: 'role_id' })
  id: number;

  @Column({ name: 'role_name' })
  name: string;

  @Column({ name: 'school_id' })
  schoolId: number;

  @ManyToOne(() => Schools, (school) => school.roles)
  @JoinColumn({ name: 'school_id' })
  school: Schools;

  @OneToMany(() => Users, (user) => user.role)
  users: Users[];

  @OneToMany(() => AppClientsRole, (client) => client.roles, { cascade: true })
  clients: AppClientsRole[];

  @OneToMany(() => RolePermissions, (role) => role.role)
  permissions: RolePermissions[];
}
