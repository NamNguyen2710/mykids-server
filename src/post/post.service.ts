import { 
  Inject,
  Injectable, 
  NotFoundException, 
  forwardRef
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostInfo } from 'src/entities/post_info.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/users/users.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostInfo)
    private postRep: Repository<PostInfo>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService
  ){}

  async create(user_id: number, createPostDto: CreatePostDto): Promise<PostInfo> {
    createPostDto.user = await this.userService.findOne(user_id);
    const newpost = this.postRep.create(createPostDto);
    return this.postRep.save(newpost);
  }

  async findAll(): Promise<PostInfo[]> {
    return this.postRep.find();
  }

  async findOneByUser(user_id: number): Promise<PostInfo[]> {
    return this.postRep.find({
      where: { 
        user: {
          id: user_id
        }
      }
    })
  }

  async update(id: number, user_id: number, updatePostDto: UpdatePostDto): Promise<PostInfo> {
    const findPost = await this.postRep.findOne({
      where: {
        user: {
          id: user_id
        },
        id: id
      }
    })

    if (!findPost) throw new NotFoundException("The post is not found");

    await this.postRep.update(id, updatePostDto);

    return this.postRep.findOne({
      where: {
        id
      }
    })
  }

  async remove(id: number, user_id: number): Promise<void> {
    const findPost = await this.postRep.findOne({
      where: {
        user: {
          id: user_id
        },
        id: id
      }
    })

    if (!findPost) throw new NotFoundException("The post is not found");

    await this.postRep.delete(id);
  }
}
