import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Roles {
  @PrimaryColumn({ name: 'role_id' })
  id: number;

  @Column({ name: 'role_name' })
  name: string;

  @OneToMany(() => Users, (user) => user.role)
  users: Users[];
}
