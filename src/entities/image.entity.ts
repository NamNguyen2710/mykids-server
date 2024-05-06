import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class Image{
    @PrimaryGeneratedColumn()
    image_id: number

    @Column()
    image: string

    @ManyToOne(() => Post, (post) => post.image)
    post: Post
}