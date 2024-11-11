import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as XRegExp from 'xregexp';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, LessThanOrEqual } from 'typeorm';

import { ClassService } from 'src/class/class.service';
import { BaseNotificationService } from 'src/base-notification/base-notification.service';

import { Posts } from './entities/post.entity';
import { Hashtags } from './entities/hashtag.entity';
import { Role } from 'src/role/entities/roles.data';
import { Users } from 'src/users/entity/users.entity';

import { ConfigedQueryPostDto } from './dto/query-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from 'src/post/dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepo: Repository<Posts>,
    @InjectRepository(Hashtags)
    private readonly hashtagRepo: Repository<Hashtags>,
    private readonly classService: ClassService,
    private readonly notificationService: BaseNotificationService,
  ) {}

  async findSchoolPosts(userId: number, query: ConfigedQueryPostDto) {
    const { limit = 20, page = 1 } = query;

    // Query builder to get all posts
    const qb = this.postRepo.createQueryBuilder('post');

    if (query.studentId) {
      const { data: classes } = await this.classService.findAll({
        studentId: query.studentId,
        limit: 50,
      });
      const schoolId = classes[0].schoolId;
      const classIds = classes.map((h) => h.id);

      qb.andWhere(
        new Brackets((qb) => {
          qb.where('post.classId IS NULL')
            .andWhere('post.schoolId = :schoolId', { schoolId })
            .orWhere('post.classId IN (:...classIds)', { classIds });
        }),
      );
    }

    if (query.facultyId) {
      const { data: classes } = await this.classService.findAll({
        facultyId: query.facultyId,
      });
      const classIds = classes.map((h) => h.id);

      // CASE 1: School post and faculty's assigned classes post
      if (query.schoolId) {
        qb.andWhere(
          new Brackets((qb) => {
            qb.where('post.classId IS NULL')
              .andWhere('post.schoolId = :schoolId', {
                schoolId: query.schoolId,
              })
              .orWhere('post.classId IN (:...classIds)', { classIds });
          }),
        );
        // CASE 2: Faculty's assigned classes post
      } else qb.andWhere('post.classId IN (:...classIds)', { classIds });
    } else {
      // CASE 3: School and All classes post
      qb.andWhere('post.schoolId = :schoolId', { schoolId: query.schoolId });

      // CASE 4: School post
      if (query.classId === null) qb.andWhere('post.classId IS NULL');
    }

    // CASE 5: Class post
    if (query.classId) {
      qb.andWhere('post.classId = :classId', {
        classId: query.classId,
      });
    }

    if (query.hashtag) {
      const hashtagObj = await this.hashtagRepo.findOne({
        where: { description: query.hashtag },
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

    const total = await qb.getCount();
    const rawPosts = await qb
      .leftJoin('post.comments', 'comments')
      .leftJoin('post.likedUsers', 'likedUsers')
      .leftJoinAndSelect('post.createdBy', 'createdBy')
      .leftJoinAndSelect('createdBy.logo', 'logo')
      .leftJoin('post.assets', 'assets')
      .groupBy('post.id')
      .addGroupBy('createdBy.id')
      .addGroupBy('logo.id')
      .addSelect([
        'COUNT(DISTINCT comments.id) as commentcount',
        'COUNT(DISTINCT likedUsers.id) as likecount',
        'SUM(CASE WHEN likedUsers.id = :userId THEN 1 ELSE 0 END) as userliked',
        `COALESCE(JSON_AGG(JSON_BUILD_OBJECT('id', assets.id,'url', assets.url)) FILTER (WHERE assets.id IS NOT NULL), '[]') AS assets`,
      ])
      .setParameter('userId', userId)
      .orderBy('post.createdAt', 'DESC')
      .limit(limit)
      .offset(limit * (page - 1))
      .getRawMany();

    const posts = rawPosts.map((post) => ({
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
        logo: post.logo_asset_id
          ? {
              id: post.logo_asset_id,
              url: post.logo_url,
            }
          : null,
      },
      assets: post.assets,
    }));

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

  async findOne(postId: number): Promise<Posts> {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['createdBy', 'comments'],
    });

    return post;
  }

  async create(userId: number, postDto: CreatePostDto) {
    const hashtagRegex = XRegExp('#[\\p{L}_]+', 'g');
    const hashtagList =
      XRegExp.match(postDto.message, hashtagRegex, 'all') || [];

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
      ...postDto,
      publishedAt: postDto.isPublished ? new Date() : null,
      createdById: userId,
      hashtags,
    });
    await this.postRepo.save(newPost);

    const post = await this.postRepo.findOne({
      where: { id: newPost.id },
      relations: ['createdBy', 'school', 'classroom'],
    });

    if (post.isPublished) {
      this.notificationService.create({
        schoolId: post.schoolId,
        classId: post.classId,
        roleId: Role.PARENT,
        title: post.classId
          ? `${post.classroom.name} - ${post.school.name}`
          : post.school.name,
        body: `${post.createdBy.firstName} ${post.createdBy.lastName} has created a new post`,
        data: { postId: post.id.toString() },
      });
    }
  }

  async update(postId: number, post: UpdatePostDto) {
    const oldPost = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['createdBy', 'school', 'classroom'],
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

    if (post.isPublished && !oldPost.publishedAt) {
      post.publishedAt = new Date();

      this.notificationService.create({
        schoolId: oldPost.schoolId,
        classId: oldPost.classId,
        roleId: Role.PARENT,
        title: oldPost.classId
          ? `${oldPost.classroom.name} - ${oldPost.school.name}`
          : oldPost.school.name,
        body: `${oldPost.createdBy.firstName} ${oldPost.createdBy.lastName} has created a new post`,
        data: { postId: oldPost.id.toString() },
      });
    }

    Object.assign(oldPost, post, { hashtags });

    await this.postRepo.save(oldPost);
    return oldPost;
  }

  async remove(postId: number): Promise<any> {
    const post = this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException();

    this.postRepo.softDelete(postId);
  }

  async like(userId: number, postId: number) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: { likedUsers: true },
    });

    if (!post) throw new NotFoundException('Post not found');

    if (post.likedUsers.some((likedUser) => likedUser.id === userId))
      throw new BadRequestException('User already liked this post');

    post.likedUsers.push({ id: userId } as Users);
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
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: { likedUsers: true },
    });

    if (!post) throw new NotFoundException('Post not found');

    if (!post.likedUsers.some((likedUser) => likedUser.id === userId))
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

  @Cron('*/1 * * * *')
  async publishedPostCron() {
    const posts = await this.postRepo.find({
      where: { isPublished: false, publishedAt: LessThanOrEqual(new Date()) },
    });

    posts.forEach(async (post) => this.update(post.id, { isPublished: true }));
  }
}
