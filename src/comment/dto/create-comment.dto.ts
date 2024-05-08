import { Posts } from "src/post/entities/post.entity";
import { Users } from "src/users/entity/users.entity";

export class CreateCommentDto {
    message: string;
    belongedTo: Posts;
    createdBy: Users;
    taggedUser: Users[];
}
