import { Comments } from 'src/comment/entities/comment.entity';
import { Users } from 'src/users/entity/users.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'comment_tagged_users' })
export class CommentTaggedUser {
  @PrimaryColumn({ name: 'tagged_user_id', type: 'int' })
  userId: number;

  @PrimaryColumn({ name: 'comment_id', type: 'int' })
  commentId: number;

  @ManyToOne(() => Users, (user) => user.taggedComments)
  @JoinColumn({ name: 'tagged_user_id' })
  user: Users;

  @ManyToOne(() => Comments, (comment) => comment.taggedUsers, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comments;
}
