import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Albums } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { QueryAlbumDto } from './dto/query-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

import { ClassService } from 'src/class/class.service';
import { AssetService } from 'src/asset/asset.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Albums)
    private readonly albumRepo: Repository<Albums>,
    private readonly assetService: AssetService,
    private readonly classService: ClassService,
  ) {}

  // Create new album
  async createAlbum(userId: number, createAlbumDto: CreateAlbumDto) {
    const { schoolId, classId } = createAlbumDto;

    if (classId) {
      const classEntity = await this.classService.validateSchoolClass(
        schoolId,
        classId,
      );
      if (!classEntity) {
        throw new BadRequestException(
          `Class with id cannot be found in user school!`,
        );
      }
    }

    const album = this.albumRepo.create({
      ...createAlbumDto,
      createdById: userId,
      publishedDate: createAlbumDto.isPublished
        ? new Date()
        : createAlbumDto.publishedDate,
    });

    return this.albumRepo.save(album);
  }

  async findAll(query: QueryAlbumDto) {
    const { schoolId, limit = 20, page = 1 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.albumRepo
      .createQueryBuilder('album')
      .leftJoin('album.school', 'school')
      .leftJoinAndSelect('album.class', 'class')
      .leftJoinAndSelect('album.createdBy', 'createdBy')
      .leftJoinAndSelect('createdBy.logo', 'logo')
      .leftJoin('album.assets', 'assets')
      .addSelect([
        'COUNT(DISTINCT assets.id) as assetcount',
        `COALESCE(JSON_AGG(JSON_BUILD_OBJECT('id', assets.id,'url', assets.url)) FILTER (WHERE assets.id IS NOT NULL), '[]') AS assets`,
      ])
      .where('album.schoolId = :schoolId', { schoolId })
      .andWhere('album.isPublished = true')
      .groupBy('album.id')
      .addGroupBy('school.id')
      .addGroupBy('class.id')
      .addGroupBy('createdBy.id')
      .addGroupBy('logo.id')
      .orderBy('album.createdDate', 'DESC')
      .offset(skip)
      .limit(limit);

    const albums = await queryBuilder.getRawMany();
    const res = albums.map((album) => ({
      id: album.album_album_id,
      title: album.album_title,
      isPublished: album.album_is_published,
      createdDate: album.album_created_date,
      updatedDate: album.album_updated_date,
      publishedDate: album.album_published_date,
      classroom: {
        id: album.class_class_id,
        name: album.class_name,
      },
      createdBy: {
        id: album.createdBy_user_id,
        firstName: album.createdBy_first_name,
        lastName: album.createdBy_last_name,
        logo: album.logo_asset_id
          ? {
              id: album.logo_asset_id,
              url: album.logo_url,
            }
          : null,
      },
      assetCount: album.assetcount,
      assets: album.assets,
    }));

    const totalItems = await this.albumRepo.count({ where: { schoolId } });

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
    const album = await this.albumRepo.findOne({ where: { id: albumId } });
    return album;
  }

  async update(albumId: number, album: UpdateAlbumDto): Promise<Albums> {
    const albumEntity = await this.albumRepo.findOne({
      where: { id: albumId },
    });
    if (!albumEntity)
      throw new NotFoundException(`Album with ID ${albumId} not found`);

    // Update array of assets to an album
    if (album.assetIds) {
      const assets = await this.assetService.findByIds(album.assetIds);
      albumEntity.assets = [...assets];
    }

    Object.assign(albumEntity, album);
    await this.albumRepo.save(albumEntity);

    return albumEntity;
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
    return { success: true, message: 'Album removed successfully' };
  }

  async validateAlbumAdminPermission(albumId: number, userId: number) {
    const album = await this.albumRepo.findOne({
      where: { id: albumId, school: { schoolAdminId: userId } },
    });

    return !!album;
  }

  async validateAlbumParentPermission(albumId: number, userId: number) {
    const album = await this.albumRepo.findOne({
      where: { id: albumId, school: { parents: { id: userId } } },
    });

    return !!album;
  }
}
