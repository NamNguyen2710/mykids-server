import { Users } from "src/users/entity/users.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";
import { Like } from "./like.entity";
import { Image } from "./image.entity";
import { HashTag } from "./hashtag.entity";


@Entity()
export class Post{
    @PrimaryGeneratedColumn({ name: 'post_id' })
    id: number;

    @Column()
    description: string;

    @Column()
    published_date: Date;

    @ManyToMany(() => HashTag)
    hashTag: HashTag

    @OneToMany(() => Image, (image) => image.post)
    image: Image[]

    @ManyToOne(() => Users, (user) => user.post)
    user: Users;

    @OneToMany(() => Like, (like) => like.post)
    like: Like

    @OneToMany(() => Comment, (comment) => comment.post)
    comment: Comment
}