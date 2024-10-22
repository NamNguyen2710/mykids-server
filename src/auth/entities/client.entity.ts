import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Roles } from 'src/role/entities/roles.entity';
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
