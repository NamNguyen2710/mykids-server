import { Entity, Column, OneToMany, PrimaryColumn, ManyToMany } from 'typeorm';
import { Users } from './users.entity';
import { AppClients } from 'src/auth/entities/client.entity';
import { AppClientsRole } from 'src/auth/entities/client_role.entity';

@Entity()
export class Roles {
  @PrimaryColumn({ name: 'role_id' })
  id: number;

  @Column({ name: 'role_name' })
  name: string;

  @OneToMany(() => Users, (user) => user.role)
  users: Users[];

  @OneToMany(() => AppClients, (client) => client.roles)
  clients: AppClientsRole[];
}
