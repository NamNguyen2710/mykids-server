import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class HashTag{
    @PrimaryGeneratedColumn()
    hashTag_id: number

    @Column()
    hashTag_name: string

    @ManyToMany(() => Post)
    post: Post
}