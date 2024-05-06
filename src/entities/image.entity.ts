import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostInfo } from "./post_info.entity";

@Entity()
export class Image{
    @PrimaryGeneratedColumn({ name: 'image_id' })
    id: number

    @Column({ name: 'image_url' })
    image: string

    @ManyToOne(() => PostInfo, (post) => post.image)
    @JoinColumn()
    post: PostInfo
}