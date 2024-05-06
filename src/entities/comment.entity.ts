import { Users } from "src/users/entity/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostInfo } from "./post_info.entity";


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

    @ManyToOne(() => PostInfo, (post) => post.comment)
    post: PostInfo
}