import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AppClient{
    @PrimaryGeneratedColumn()
    number: number;

    @Column()
    id: string;

    @Column()
    secret: string;

    @Column()
    expireIn: string;
}