import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Role } from "./roles.entity";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Role, (role) => role.users, {eager: true})
    @JoinColumn()
    role: Role

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    number: string;

    @Column()
    isactive: boolean;

    @Column({nullable: true})
    otp: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}