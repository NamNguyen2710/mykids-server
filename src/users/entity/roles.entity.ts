import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Users, (user) => user.role)
    users: Users[]
}