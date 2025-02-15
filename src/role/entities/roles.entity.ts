import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from 'src/users/entity/users.entity';
import { AppClientsRole } from 'src/auth/entities/client_role.entity';
import { RolePermissions } from 'src/role/entities/role-permission.entity';
import { Schools } from 'src/school/entities/school.entity';
import { BaseNotifications } from 'src/base-notification/entities/base-notification.entity';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn({ name: 'role_id' })
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

  @OneToMany(() => BaseNotifications, (notification) => notification.role)
  baseNotifications: BaseNotifications[];
}
