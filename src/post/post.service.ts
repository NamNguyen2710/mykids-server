import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as XRegExp from 'xregexp';

import { NotificationsService } from 'src/notifications/notifications.service';
import { UserService } from 'src/users/users.service';

import * as Role from 'src/users/entity/roles.data';
import { Posts } from './entities/post.entity';
import { Hashtags } from './entities/hashtag.entity';
import { QueryPostDto } from './dto/query-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from 'src/post/dto/update-post.dto';
import { ListResponse } from 'src/utils/list-response.dto';
import { ResponsePostDto } from './dto/response-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts) private readonly postRepo: Repository<Posts>,
    @InjectRepository(Hashtags)
    private readonly hashtagRepo: Repository<Hashtags>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationsService,
  ) {}

  async findSchoolPosts(
    userId: number,
    query: QueryPostDto,
  ): Promise<ListResponse<ResponsePostDto>> {
    let { schoolId, limit = 20, page = 1, hashtag } = query;

    const user = await this.userService.findOne(userId, [
      'schools',
      'assignedSchool',
    ]);
    if (!user) throw new UnauthorizedException('User not found');

    let schoolIds = [];

    if (user.role.name === Role.SchoolAdmin.name) {
      schoolId = user.assignedSchool.id;
    } else if (user.role.name === Role.Parent.name) {
      schoolIds = user.schools.map((school) => school.id);

      if (!schoolId && schoolIds.length == 0)
        return {
          data: [],
          pagination: { totalItems: 0, totalPages: 0, page, limit },
        };

      if (schoolId && !schoolIds.includes(schoolId))
        throw new BadRequestException('User is not part of this school');
    }

    // Query builder to get all posts
    const qb = this.postRepo.createQueryBuilder('post');

    if (schoolId) {
      qb.where('post.school_id = :schoolId', { schoolId });
    } else {
      qb.where('post.school_id IN (:...schoolIds)', { schoolIds });
    }

    if (hashtag) {
      const hashtagObj = await this.hashtagRepo.findOne({
        where: { description: hashtag },
      });

      if (!hashtagObj)
        return {
          data: [],
          pagination: { totalItems: 0, totalPages: 0, page, limit },
        };

      qb.innerJoin('post.hashtags', 'hashtags', 'hashtags.id = :hashtagId', {
        hashtagId: hashtagObj.id,
      });
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
        'SUM(CASE WHEN likedUsers.id = :userId THEN 1 ELSE 0 END) as userliked',
      ])
      .setParameter('userId', userId)
      .orderBy('post.createdAt', 'DESC')
      .getRawMany();
    if (!rawPosts) throw new NotFoundException();

    const posts = rawPosts
      .splice(limit * (page - 1), limit * page)
      .map((post) => ({
        id: post.post_post_id,
        message: post.post_message,
        isPublished: post.post_is_published,
        createdAt: post.post_created_at,
        updatedAt: post.post_updated_at,
        publishedAt: post.post_published_at,
        schoolId: post.post_school_id,
        commentCount: parseInt(post.commentcount),
        likeCount: parseInt(post.likecount),
        likedByUser: parseInt(post.userliked) >= 1,
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
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  async findOne(userId: number, postId: number): Promise<Posts> {
    if (!userId) throw new NotFoundException('Unauthorized!');
    const post = await this.postRepo.findOne({
      where: { id: postId, school: { parents: { id: userId } } },
    });
    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  async create(userId: number, post: CreatePostDto): Promise<Posts> {
    const hashtagRegex = XRegExp('#[\\p{L}_]+', 'g');
    const hashtagList = XRegExp.match(post.message, hashtagRegex, 'all') || [];

    const hashtags = await Promise.all(
      hashtagList.map(async (ht) => {
        const hashtag = await this.hashtagRepo.findOne({
          where: { description: ht },
        });

        if (!hashtag) return this.hashtagRepo.create({ description: ht });
        else return hashtag;
      }),
    );

    const newPost = this.postRepo.create({
      ...post,
      publishedAt: post.isPublished ? new Date() : null,
      createdById: userId,
      hashtags,
    });
    await this.postRepo.save(newPost);

    this.notificationService.createNotification(
      newPost.schoolId,
      'New Post',
      'Created New Post',
      { postId: newPost.id.toString() },
    );

    return this.postRepo.findOne({
      where: { id: newPost.id },
      relations: ['createdBy'],
    });
  }

  async update(postId: number, post: UpdatePostDto) {
    const oldPost = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['createdBy'],
    });

    if (!oldPost) throw new NotFoundException();

    const hashtagRegex = XRegExp('#[\\p{L}_]+', 'g');
    const hashtagList = XRegExp.match(post.message, hashtagRegex, 'all') || [];

    const hashtags = await Promise.all(
      hashtagList.map(async (ht) => {
        const hashtag = await this.hashtagRepo.findOne({
          where: { description: ht },
        });
        if (!hashtag) return this.hashtagRepo.create({ description: ht });
        else return hashtag;
      }),
    );

    Object.assign(oldPost, post, {
      hashtags,
      publishedAt: oldPost.publishedAt
        ? oldPost.publishedAt
        : post.isPublished
          ? new Date()
          : null,
    });
    return this.postRepo.save(oldPost);
  }

  async remove(postId: number): Promise<any> {
    const post = this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException();

    this.postRepo.softDelete(postId);
  }

  async like(userId: number, postId: number) {
    const user = await this.userService.findOne(userId);
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

    const rawPosts = await this.postRepo
      .createQueryBuilder('post')
      .where('post.id = :postId', { postId })
      .leftJoin('post.likedUsers', 'likedUsers')
      .groupBy('post.id')
      .select('COUNT(DISTINCT likedUsers.id) as likecount')
      .getRawMany();

    return { status: 'success', likeCount: parseInt(rawPosts[0].likecount) };
  }

  async unlike(userId: number, postId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: { likedUsers: true },
    });

    if (!post) throw new NotFoundException('Post not found');

    if (!post.likedUsers.some((likedUser) => likedUser.id == userId))
      throw new BadRequestException("User haven't liked this post");

    post.likedUsers = post.likedUsers.filter(
      (likedUser) => likedUser.id != userId,
    );
    await this.postRepo.save(post);

    const rawPosts = await this.postRepo
      .createQueryBuilder('post')
      .where('post.id = :postId', { postId })
      .leftJoin('post.likedUsers', 'likedUsers')
      .groupBy('post.id')
      .select('COUNT(DISTINCT likedUsers.id) as likecount')
      .getRawMany();

    return { status: 'success', likeCount: parseInt(rawPosts[0].likecount) };
  }

  async validatePostPermission(userId: number, postId: number) {
    const post = await this.postRepo.findOne({
      where: { id: postId, createdById: userId },
    });

    return !!post;
  }
}
