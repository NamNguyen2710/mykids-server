import { Users } from "src/users/entity/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";


@Entity()
export class Comment{
    @PrimaryGeneratedColumn({ name: 'comment_id' })
    comment_id: number

    @Column()
    text: string

    @Column()
    placeholder: string

    @ManyToOne(() => Users, (user) => user.comment)
    user: Users

    @ManyToOne(() => Post, (post) => post.comment)
    post: Post
}