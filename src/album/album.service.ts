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
    const { schoolId, classId, publishedDate } = createAlbumDto;

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
      publishedDate: publishedDate ? new Date(publishedDate) : null,
    });

    return this.albumRepo.save(album);
  }

  async findAll(query: QueryAlbumDto) {
    const { schoolId, limit = 20, page = 0 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.albumRepo
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.school', 'school')
      .leftJoinAndSelect('album.class', 'class')
      .leftJoinAndSelect('album.createdBy', 'createdBy')
      .leftJoinAndSelect('album.assets', 'assets')
      .addSelect('COUNT(DISTINCT assets.id) as assetcount')
      .where('album.schoolId = :schoolId', { schoolId })
      .groupBy('album.id')
      .orderBy('album.createdDate', 'DESC')
      .skip(skip)
      .take(limit);
    const albums = await queryBuilder.getRawMany();

    const totalItems = await this.albumRepo.count({ where: { schoolId } });

    return {
      data: albums,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        page,
        limit,
      },
    };
  }

  async findOne(userId: number, albumId: number) {
    const album = await this.albumRepo.findOne({ where: { id: albumId } });
    return album;
  }

  async update(albumId: number, album: UpdateAlbumDto): Promise<Albums> {
    // Update array of assets to an album
    if (album.assetIds) {
      const assets = await this.assetService.findByIds(album.assetIds);
      (album as any).assets = assets;
    }

    const res = await this.albumRepo.update(albumId, { ...album });
    if (res.affected === 0) throw new NotFoundException();

    return this.albumRepo.findOne({ where: { id: albumId } });
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
