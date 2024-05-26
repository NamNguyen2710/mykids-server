import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Posts } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Users } from 'src/users/entity/users.entity';
import { QueryPostDto } from 'src/post/dto/query-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepo: Repository<Posts>,
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
  ) {}

  // create(createPostDto: CreatePostDto) {
  //   return 'This action adds a new post';
  // }

  async findSchoolPosts(userId: number, query: QueryPostDto) {
    const { schoolId, limit = 20, page = 1 } = query;
    if (!userId) throw new UnauthorizedException();

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { schools: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const schoolIds = user.schools.map((school) => school.id);

    if (!schoolId && schoolIds.length == 0)
      return {
        data: [],
        pagination: { totalItem: 0, totalPage: 0, page, limit },
      };

    if (schoolId && !schoolIds.includes(schoolId))
      throw new BadRequestException('User is not part of this school');

    // Query builder to get all posts
    const qb = this.postRepo.createQueryBuilder('post');

    if (schoolId) {
      qb.where('post.school_id = :schoolId', { schoolId });
    } else {
      qb.where('post.school_id IN (:...schoolIds)', { schoolIds });
    }

    const rawPosts = await qb
      .leftJoin('post.comments', 'comments')
      .leftJoin('post.likedUsers', 'likedUsers')
      .leftJoinAndSelect('post.createdBy', 'createdBy')
      .groupBy('post.id')
      .addGroupBy('createdBy.id')
      .addSelect([
        'COUNT(DISTINCT comments.id) as commentcount',
        'COUNT(DISTINCT likedUsers.id) as likecount',
      ])
      .orderBy('post.createdAt', 'DESC')
      .take(limit)
      .skip((page - 1) * limit)
      .getRawMany();
    if (!rawPosts) throw new NotFoundException();

    const posts = rawPosts.map((post) => ({
      id: post.post_post_id,
      message: post.post_message,
      isPublished: post.post_is_published,
      createdAt: post.post_created_at,
      updatedAt: post.post_updated_at,
      publishedAt: post.post_published_at,
      schoolId: post.post_school_id,
      commentCount: post.commentcount,
      likeCount: post.likecount,
      createdBy: {
        id: post.post_created_by_id,
        firstName: post.createdBy_first_name,
        lastName: post.createdBy_last_name,
        phoneNumber: post.createdBy_phone_number,
      },
    }));

    // Get total count of posts
    const total = await this.postRepo.countBy({
      schoolId: schoolId ? schoolId : In(schoolIds),
    });

    return {
      data: posts,
      pagination: {
        totalItem: total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  async publishedPost(userId: number, postId: number): Promise<Posts> {
    if (!userId) throw new UnauthorizedException();

    const post = await this.postRepo.findOne({
      where: {
        id: postId,
        isPublished: false,
      },
    });

    if (!post) throw new NotFoundException();

    post.isPublished = true;
    post.publishedAt = new Date();
    return this.postRepo.save(post);
  }

  async remove(schoolId: number, postId: number): Promise<any> {
    const post = this.postRepo.findOne({
      where: {
        school: { id: schoolId },
        id: postId,
      },
    });

    if (!post) throw new NotFoundException();

    this.postRepo.softDelete(postId);
  }

  async like(userId: number, postId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: { likedUsers: true },
    });

    if (!post) throw new NotFoundException('Post not found');

    if (post.likedUsers.some((likedUser) => likedUser.id == userId))
      throw new BadRequestException('User already liked this post');

    post.likedUsers.push(user);
    await this.postRepo.save(post);

    return { status: 'success' };
  }

  async unlike(userId: number, postId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: { likedUsers: true },
    });

    if (!post) throw new NotFoundException('Post not found');

    if (!post.likedUsers.some((likedUser) => likedUser.id == userId))
      throw new BadRequestException("User haven't liked this post");

    post.likedUsers.filter((likedUser) => likedUser.id != userId);
    await this.postRepo.save(post);

    return { status: 'success' };
  }
}
