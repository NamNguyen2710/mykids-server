import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Roles } from 'src/role/entities/roles.entity';
import { AppClients } from './client.entity';

@Entity({ name: 'app_clients_role' })
export class AppClientsRole {
  @PrimaryColumn({ name: 'client_id', type: 'string' })
  clientId: string;

  @PrimaryColumn({ name: 'role_id', type: 'int' })
  roleId: number;

  @ManyToOne(() => AppClients, (appClients) => appClients.roles)
  @JoinColumn({ name: 'client_id' })
  clients: AppClients;

  @ManyToOne(() => Roles, (role) => role.clients)
  @JoinColumn({ name: 'role_id' })
  roles: Roles;
}
