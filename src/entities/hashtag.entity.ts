import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostInfo } from "./post_info.entity";

@Entity()
export class HashTag{
    @PrimaryGeneratedColumn({ name: 'hashtag_id' })
    id: number

    @Column({ name: 'hashtag_name' })
    name: string

    @ManyToMany(() => PostInfo)
    post: PostInfo[]
}