import { Users } from "src/users/entity/users.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostInfo } from "./post_info.entity";

@Entity()
export class Like{
    @PrimaryGeneratedColumn({ name: 'like_id' })
    id: number

    @ManyToOne(() => Users, (user) => user.like)
    @JoinColumn()
    user: Users

    @ManyToOne(() => PostInfo, (post) => post.like)
    @JoinColumn()
    post: PostInfo
}