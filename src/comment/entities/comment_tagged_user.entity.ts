import { Comments } from 'src/comment/entities/comment.entity';
import { Users } from 'src/users/entity/users.entity';
import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'comment_tagged_user' })
export class CommentTaggedUser {
  @PrimaryColumn()
  placeholder: string;

  @PrimaryColumn({ name: 'user_id', type: 'int' })
  userId: number;

  @PrimaryColumn({ name: 'comment_id', type: 'int' })
  commentId: number;

  @Column()
  text: string;

  @ManyToOne(() => Users, (user) => user.taggedComments)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Comments, (comment) => comment.taggedUsers, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comments;

  @AfterLoad()
  removeIds() {
    if (this.user) delete this.userId;
    if (this.comment) delete this.commentId;
  }
}
