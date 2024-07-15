import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as Role from 'src/users/entity/roles.data';
import { CreateAlbumDto } from './dto/create-album.dto';
import { QueryAlbumDto } from './dto/query-album.dto';
import { UserService } from 'src/users/users.service';
import { AssetService } from 'src/asset/asset.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Albums } from './entities/album.entity';
import { SchoolService } from 'src/school/school.service';
import { ClassService } from 'src/class/class.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Albums)
    private readonly albumRepo: Repository<Albums>,
    private readonly userService: UserService,
    private readonly assetService: AssetService,
    private readonly schoolService: SchoolService,
    private readonly classService: ClassService,
  ) {}

  // Create new album
  async createAlbum(
    userId: number,
    createAlbumDto: CreateAlbumDto,
  ): Promise<Albums> {
    const { schoolId, classId, createdById, publishedDate } = createAlbumDto;
    if (userId !== createdById) throw new BadRequestException('Request fail!');

    const school = await this.schoolService.findSchoolWithID(
      createdById,
      schoolId,
    );

    let classEntity;
    if (classId) {
      classEntity = await this.classService.findOne(classId);
      if (!classEntity) {
        throw new NotFoundException(
          `Class with id cannot be found in user school!`,
        );
      }
    }

    const user = await this.userService.findOne(createdById);

    const album = this.albumRepo.create({
      school: school,
      class: classEntity,
      createdBy: user,
      publishedDate: publishedDate ? new Date(publishedDate) : null,
    });

    return this.albumRepo.save(album);
  }

  // Add Array of assets to an album
  async addAssetsToAlbum(albumId: number, assetIds: number[]): Promise<Albums> {
    const album = await this.albumRepo.findOne({
      where: { id: albumId },
      relations: ['assets'],
    });

    if (!album) {
      throw new NotFoundException(`Cannot found album!`);
    }

    const assets = await this.assetService.findByIds(assetIds);

    if (assets.length !== assetIds.length) {
      throw new NotFoundException(`One or more assets were not found!`);
    }

    album.assets = [...album.assets, ...assets];
    album.assetCount = await this.assetService.countAssetsInAlbums(albumId);
    return this.albumRepo.save(album);
  }

  async removeAssetsFromAlbum(
    albumId: number,
    assetIds: number[],
  ): Promise<Albums> {
    const album = await this.albumRepo.findOne({
      where: { id: albumId },
      relations: ['assets'],
    });

    if (!album) {
      throw new NotFoundException(`Album with ID ${albumId} not found`);
    }

    album.assets = album.assets.filter((asset) => !assetIds.includes(asset.id));
    album.assetCount = await this.assetService.countAssetsInAlbums(albumId);
    return this.albumRepo.save(album);
  }

  async getAlbumsBySchool(userId: number, query: QueryAlbumDto): Promise<any> {
    const { schoolId, limit, page } = query;
    const skip = (page - 1) * limit;

    await this.schoolService.findSchoolWithID(userId, schoolId);

    const queryBuilder = this.albumRepo
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.school', 'school')
      .leftJoinAndSelect('album.class', 'class')
      .leftJoinAndSelect('album.createdBy', 'createdBy')
      .leftJoinAndSelect('album.assets', 'assets')
      .where('album.schoolId = :schoolId', { schoolId })
      .loadRelationCountAndMap('album.assetCount', 'album.assets')
      .groupBy('album.id')
      .orderBy('album.id', 'DESC')
      .skip(skip)
      .take(limit);

    const albums = await queryBuilder.getMany();

    return albums.map((album) => ({
      ...album,
      assetCount: album.assetCount,
    }));
  }

  async openOneAlbum(userId: number, albumId: number) {
    const user = await this.userService.findOne(userId);

    const album = await this.albumRepo.findOne({ where: { id: albumId } });
    console.log(album);

    if (user.role.name == Role.SchoolAdmin.name) {
      const albumAssets = await this.assetService.getAssetsOfSchoolAlbum(
        userId,
        albumId,
      );

      console.log(albumAssets);
      if (!albumAssets)
        throw new NotFoundException('Cannot find this specific album!');
      return albumAssets;
    }

    if (user.role.name == Role.Parent.name) {
      const albumAssets = this.assetService.getAssetsOfParentsAlbum(
        userId,
        albumId,
      );

      if (!albumAssets)
        throw new NotFoundException('Cannot find this specifc album!');
      return albumAssets;
    }
  }

  async removeAlbum(albumId: number): Promise<any> {
    const album = await this.albumRepo.findOne({
      where: { id: albumId },
      relations: ['assets'],
    });

    if (!album) {
      throw new NotFoundException(`Album with ID ${albumId} not found`);
    }

    // Detach the assets from the album to prevent cascade delete
    album.assets = [];

    // Remove the album from the repository
    await this.albumRepo.remove(album);
  }

  async validateAlbumAdminPermission(albumId: number, userId: number) {
    const loa = await this.albumRepo.findOne({
      where: { id: albumId, school: { schoolAdminId: userId } },
    });

    return !!loa;
  }

  async validateAlbumParentPermission(albumId: number, userId: number) {
    const loa = await this.albumRepo.findOne({
      where: { id: albumId, school: { parents: { id: userId } } },
    });

    return !!loa;
  }
}
