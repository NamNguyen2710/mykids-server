import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AppClient{
    @PrimaryGeneratedColumn()
    number: string;

    @Column()
    id: string;

    @Column()
    secret: string;

    @Column()
    expireIn: string;
}