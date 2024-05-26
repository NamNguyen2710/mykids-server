import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'app_clients' })
export class AppClients {
  @PrimaryColumn({ name: 'client_id' })
  id: string;

  @Column()
  secret: string;

  @Column()
  expiresIn: string;
}
