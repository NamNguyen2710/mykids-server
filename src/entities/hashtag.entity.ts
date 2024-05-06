import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class HashTag{
    @PrimaryGeneratedColumn({ name: 'hashtag_id' })
    id: number

    @Column({ name: 'hashtag_name' })
    name: string

    @ManyToMany(() => Post)
    post: Post
}