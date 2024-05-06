import { Users } from "src/users/entity/users.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class Like{
    @PrimaryGeneratedColumn()
    like_id: number

    @ManyToOne(() => Users, (user) => user.like)
    user: Users

    @ManyToOne(() => Post, (post) => post.like)
    post: Post
}