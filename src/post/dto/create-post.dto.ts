import { Image } from "src/entities/image.entity";
import { Users } from "src/users/entity/users.entity";

export class CreatePostDto {
    description: string;
    hashtag: string;
    image: Image[];
    user: Users;
}
