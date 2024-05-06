import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from "typeorm";
import { Role } from "./roles.entity";
import { PostInfo } from "src/entities/post_info.entity";
import { Comment } from "src/entities/comment.entity";
import { Like } from "src/entities/like.entity";

@Entity()
export class Users {
    @PrimaryGeneratedColumn({ name: 'user_id' })
    id: number;

    @ManyToOne(() => Role, (role) => role.users, {eager: true})
    @JoinColumn()
    role: Role

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    number: string;

    @Column()
    isactive: boolean;

    @Column({nullable: true})
    otp: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => PostInfo, (post) => post.user)
    post: PostInfo[]

    @OneToMany(() => Like, (like) => like.user)
    like: Like[]

    @OneToMany(() => Comment, (comment) => comment.user)
    comment: Comment[]
}