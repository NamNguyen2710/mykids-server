import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  id: number;

  @Column({ name: 'role_name' })
  name: string;

  @OneToMany(() => Users, (user) => user.role)
  users: Users[];
}
