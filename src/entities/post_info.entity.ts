import { Users } from "src/users/entity/users.entity";
import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    JoinColumn, 
    ManyToMany, 
    ManyToOne, 
    OneToMany, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn
} from "typeorm";

import { Comment } from "./comment.entity";
import { Like } from "./like.entity";
import { Image } from "./image.entity";
import { HashTag } from "./hashtag.entity";


@Entity()
export class PostInfo{
    @PrimaryGeneratedColumn({ name: 'post_id' })
    id: number;

    @Column({ name: 'post_description' })
    description: string;

    @CreateDateColumn()
    published_date: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToMany(() => HashTag)
    hashTag: HashTag

    @OneToMany(() => Image, (image) => image.post, {eager: true})
    image: Image[]

    @ManyToOne(() => Users, (user) => user.post, {eager: true})
    @JoinColumn()
    user: Users;

    @OneToMany(() => Like, (like) => like.post, {eager: true})
    like: Like[]

    @OneToMany(() => Comment, (comment) => comment.post, {eager: true})
    comment: Comment[]
}