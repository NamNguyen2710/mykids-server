import { Roles } from 'src/users/entity/roles.entity';
import { Entity, Column, PrimaryColumn, ManyToMany, OneToMany } from 'typeorm';
import { AppClientsRole } from './client_role.entity';

@Entity({ name: 'app_clients' })
export class AppClients {
  @PrimaryColumn({ name: 'client_id' })
  id: string;

  @Column()
  secret: string;

  @Column()
  expiresIn: string;

  @OneToMany(() => Roles, (role) => role.clients)
  roles: AppClientsRole[];
}
