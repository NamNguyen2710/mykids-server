import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class Image{
    @PrimaryGeneratedColumn({ name: 'image_id' })
    id: number

    @Column({ name: 'image_string' })
    image: string

    @ManyToOne(() => Post, (post) => post.image)
    post: Post
}