import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as Role from 'src/users/entity/roles.data';
import { CreateAlbumDto } from './dto/create-album.dto';
import { QueryAlbumDto } from './dto/query-album.dto';
import { AddAssetDTO } from './dto/add-asset.dto';
import { UserService } from 'src/users/users.service';
import { AssetService } from 'src/asset/asset.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Albums } from './entities/album.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Albums)
    private readonly albumRepo: Repository<Albums>,
    private readonly userService: UserService,
    private readonly assetService: AssetService,
  ) {}

  // Create new album
  async create(
    userId: number,
    createAlbumDto: CreateAlbumDto,
  ): Promise<Albums> {
    // Add album name and created by id to the data
    const album = this.albumRepo.create({
      ...createAlbumDto,
      createdById: userId,
    });
    await this.albumRepo.save(album);
    return album;
  }

  // Add Array of assets to an album
  async addAssetToAlbum(albumId: number, assetDto: AddAssetDTO): Promise<any> {
    const album = await this.albumRepo.findOne({ where: { id: albumId } });
    if (!album) throw new NotFoundException('Cannot find album!');

    assetDto.assets?.map((asset) => album.assets.push(asset));

    const updatedAlbum = await this.albumRepo.save(album);
    return updatedAlbum;
  }

  async removeAssetFromAlbum(
    albumId: number,
    assetIds: number[],
  ): Promise<any> {
    const album = await this.albumRepo.findOne({
      where: { id: albumId },
      relations: { assets: true },
    });
    if (!album) throw new NotFoundException('Cannot find album!');

    assetIds.map(async (assetToRemove) => {
      album.assets = album.assets.filter((asset) => {
        return asset.id !== assetToRemove;
      });
      await this.albumRepo.save(album);
    });

    return album;
  }

  async getSchoolAlbum(userId: number, query: QueryAlbumDto): Promise<any> {
    const { schoolId, limit, page } = query;

    const user = await this.userService.findOne(userId, ['schools']);
    if (!user) throw new UnauthorizedException('User not found!');

    const album = await this.albumRepo.find({
      where: { schoolId: user.assignedSchool.id },
    });

    const albumIds = album.map((album) => album.id);

    if (!user.assignedSchool.id && albumIds.length == 0)
      return {
        data: [],
      };

    if (user.assignedSchool.id != schoolId)
      throw new BadRequestException('User is not part of this school');

    const qb = this.albumRepo.createQueryBuilder('post');

    const rawAlbums = await qb
      .leftJoin('album.assets', 'assets')
      .leftJoinAndSelect('album.createdBy', 'createdBy')
      .groupBy('album.id')
      .addSelect(['COUNT(DISTINCT assets.id) as assetcount'])
      .setParameter('userId', userId)
      .orderBy('post.createdAt', 'DESC')
      .take(limit)
      .skip((page - 1) * limit)
      .getRawMany();
    if (!rawAlbums) throw new NotFoundException();

    const albums = rawAlbums.map((album) => ({
      id: album.album_album_id,
      createdBy: {
        id: album.album_created_by_id,
        firstName: album.createdBy_first_name,
      },
    }));

    const total = await this.assetService.countAssetsInAlbums(albumIds);

    return {
      data: albums,
      pagination: {
        totalItems: total,
      },
    };
  }

  async openOneAlbum(userId: number, albumId: number) {
    const user = await this.userService.findOne(userId);

    if (user.role.name == Role.SchoolAdmin.name) {
      const albumAssets = this.assetService.getAssetsOfSchoolAlbum(
        userId,
        albumId,
      );

      if (!albumAssets)
        throw new NotFoundException('Cannot find this specific album!');
      return albumAssets;
    }

    if (user.role.name == Role.Parent.name) {
      const albumAssets = this.assetService.getAssetsOfParentsAlbum(
        userId,
        albumId,
      );

      if (!albumAssets) throw new NotFoundException('Cannot find LOA notice!');
      return albumAssets;
    }
  }

  async removeAlbum(albumId: number): Promise<any> {
    const album = this.albumRepo.findOne({ where: { id: albumId } });
    if (!album) throw new NotFoundException('Cannot find album!');

    this.albumRepo.delete(albumId);
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
