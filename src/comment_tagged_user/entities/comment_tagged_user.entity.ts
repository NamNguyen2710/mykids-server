import { Comments } from 'src/comment/entities/comment.entity';
import { Users } from 'src/users/entity/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'comment_tagged_user' })
export class CommentTaggedUser {
  @PrimaryColumn()
  placeholder: string;

  @Column()
  text: string;

  @ManyToOne(() => Users, (user) => user.taggedComments)
  @JoinColumn({ name: 'user_id' })
  @PrimaryColumn({ name: 'user_id', type: 'int' })
  user: Users;

  @ManyToOne(() => Comments, (comment) => comment.taggedUsers)
  @JoinColumn({ name: 'comment_id' })
  @PrimaryColumn({ name: 'comment_id', type: 'int' })
  comment: Comments;
}
