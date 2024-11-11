import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, LessThanOrEqual } from 'typeorm';

import { AssetService } from 'src/asset/asset.service';
import { ClassService } from 'src/class/class.service';
import { BaseNotificationService } from 'src/base-notification/base-notification.service';

import { CreateAlbumDto } from './dto/create-album.dto';
import { ConfigedQueryAlbumDto } from './dto/query-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

import { Albums } from './entities/album.entity';
import { Role } from 'src/role/entities/roles.data';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Albums)
    private readonly albumRepo: Repository<Albums>,
    private readonly assetService: AssetService,
    private readonly classService: ClassService,
    private readonly notificationService: BaseNotificationService,
  ) {}

  // Create new album
  async createAlbum(userId: number, createAlbumDto: CreateAlbumDto) {
    const newAlbum = this.albumRepo.create({
      ...createAlbumDto,
      createdById: userId,
      publishedDate: createAlbumDto.isPublished
        ? new Date()
        : createAlbumDto.publishedDate,
    });

    await this.albumRepo.save(newAlbum);

    const album = await this.findOne(newAlbum.id);

    if (createAlbumDto.isPublished) {
      this.notificationService.create({
        schoolId: album.schoolId,
        classId: album.classId,
        roleId: Role.PARENT,
        title: album.classId
          ? `${album.classroom.name} - ${album.school.name}`
          : album.school.name,
        body: `New album ${album.title} has been published`,
        data: { albumId: `${album.id}` },
      });
    }

    return album;
  }

  async findAll(query: ConfigedQueryAlbumDto) {
    const { limit = 20, page = 1 } = query;
    const skip = (page - 1) * limit;

    const qb = this.albumRepo
      .createQueryBuilder('album')
      .leftJoin('album.school', 'school')
      .leftJoinAndSelect('album.classroom', 'class')
      .leftJoinAndSelect('album.createdBy', 'createdBy')
      .leftJoinAndSelect('createdBy.user', 'user')
      .leftJoinAndSelect('user.logo', 'logo')
      .leftJoin('album.assets', 'assets')
      .addSelect([
        'COUNT(DISTINCT assets.id) as assetcount',
        `COALESCE(JSON_AGG(JSON_BUILD_OBJECT('id', assets.id,'url', assets.url)) FILTER (WHERE assets.id IS NOT NULL), '[]') AS assets`,
      ])
      .groupBy('album.id')
      .addGroupBy('school.id')
      .addGroupBy('class.id')
      .addGroupBy('createdBy.userId')
      .addGroupBy('user.id')
      .addGroupBy('logo.id')
      .orderBy('album.createdDate', 'DESC');

    if (query.isPublished !== undefined) {
      qb.where('album.isPublished = :isPublished', {
        isPublished: query.isPublished,
      });
    }

    if (query.studentId) {
      const { data: classes } = await this.classService.findAll({
        studentId: query.studentId,
        limit: 50,
      });
      const schoolId = classes[0].schoolId;
      const classIds = classes.map((h) => h.id);

      qb.andWhere(
        new Brackets((qb) => {
          qb.where('album.classId IS NULL')
            .andWhere('album.schoolId = :schoolId', { schoolId })
            .orWhere('album.classId IN (:...classIds)', { classIds });
        }),
      );
    }

    if (query.facultyId) {
      const { data: classes } = await this.classService.findAll({
        facultyId: query.facultyId,
      });
      const classIds = classes.map((h) => h.id);

      // CASE 1: School album and faculty's assigned classes album
      if (query.schoolId) {
        qb.andWhere(
          new Brackets((qb) => {
            qb.where('album.classId IS NULL')
              .andWhere('album.schoolId = :schoolId', {
                schoolId: query.schoolId,
              })
              .orWhere('album.classId IN (:...classIds)', { classIds });
          }),
        );
        // CASE 2: Faculty's assigned classes album
      } else qb.andWhere('album.classId IN (:...classIds)', { classIds });
    } else {
      // CASE 3: All School and classes album
      qb.andWhere('album.schoolId = :schoolId', { schoolId: query.schoolId });

      // CASE 4: School album
      if (query.classId === null) qb.andWhere('album.classId IS NULL');
    }

    // CASE 5: Class album
    if (query.classId) {
      qb.andWhere('album.classId = :classId', {
        classId: query.classId,
      });
    }

    const totalItems = await qb.getCount();
    const albums = await qb.offset(skip).limit(limit).getRawMany();
    const res = albums.map((album) => ({
      id: album.album_album_id,
      title: album.album_title,
      isPublished: album.album_is_published,
      createdDate: album.album_created_date,
      updatedDate: album.album_updated_date,
      publishedDate: album.album_published_date,
      classroom: album.class_class_id && {
        id: album.class_class_id,
        name: album.class_name,
      },
      createdBy: {
        id: album.createdBy_user_id,
        firstName: album.user_first_name,
        lastName: album.user_last_name,
        logo: album.logo_asset_id
          ? {
              id: album.logo_asset_id,
              url: album.logo_url,
            }
          : null,
      },
      assetCount: Number(album.assetcount),
      assets: album.assets,
    }));

    return {
      data: res,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        page,
        limit,
      },
    };
  }

  async findOne(albumId: number) {
    const album = await this.albumRepo.findOne({
      where: { id: albumId },
      relations: ['createdBy.user', 'classroom', 'school'],
    });
    return album;
  }

  async update(albumId: number, album: UpdateAlbumDto) {
    const albumEntity = await this.albumRepo.findOne({
      where: { id: albumId },
    });
    if (!albumEntity)
      throw new NotFoundException(`Album with ID ${albumId} not found`);

    // Update array of assets to an album
    if (album.assetIds) {
      const assets = await this.assetService.findByIds(album.assetIds);
      albumEntity.assets = [...assets];
      delete album.assetIds;
    }

    if (album.isPublished && !albumEntity.isPublished) {
      albumEntity.publishedDate = new Date();

      this.notificationService.create({
        schoolId: albumEntity.schoolId,
        classId: albumEntity.classId,
        roleId: Role.PARENT,
        title: albumEntity.classId
          ? `${albumEntity.classroom.name} - ${albumEntity.school.name}`
          : albumEntity.school.name,
        body: `New album ${albumEntity.title} has been published`,
        data: { albumId: `${albumEntity.id}` },
      });
    }

    Object.assign(albumEntity, album);
    await this.albumRepo.save(albumEntity);

    return this.findOne(albumId);
  }

  async remove(albumId: number): Promise<any> {
    const album = await this.albumRepo.findOne({ where: { id: albumId } });

    if (!album) {
      throw new NotFoundException(`Album with ID ${albumId} not found`);
    }

    const res = await this.albumRepo.remove(album);
    if (!res) {
      throw new BadRequestException(
        `Failed to remove album with ID ${albumId}`,
      );
    }
  }

  async validateAlbumParentPermission(albumId: number, userId: number) {
    const album = await this.albumRepo.findOne({
      where: { id: albumId },
      relations: [
        'school.parents',
        'class.students.student.parents',
        'createdBy.user',
      ],
    });
    if (!album) return null;

    if (album.classroom?.students) {
      const permission = album.classroom.students.reduce((acc, student) => {
        const parent = student.student.parents.find(
          (parent) => parent.parentId === userId,
        );
        return acc || !!parent;
      }, false);

      if (permission) return album;
      else return null;
    }

    const permission = album.school.parents.some(
      (parent) => parent.userId === userId,
    );

    if (permission) return album;
    else return null;
  }

  @Cron('*/1 * * * *')
  async publishAlbumCron() {
    const albums = await this.albumRepo.find({
      where: { isPublished: false, publishedDate: LessThanOrEqual(new Date()) },
    });

    albums.map(async (album) => this.update(album.id, { isPublished: true }));
  }
}
