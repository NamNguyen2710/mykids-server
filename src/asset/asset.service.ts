import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository, In } from 'typeorm';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { Assets } from 'src/asset/entities/asset.entity';

@Injectable()
export class AssetService {
  private s3: S3Client;

  constructor(
    @InjectRepository(Assets)
    private readonly assetRepository: Repository<Assets>,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3Client({
      region: this.configService.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_S3_ACCESS_KEY_SECRET'),
      },
    });
  }

  async uploadFile(files) {
    const uploadedFile = files.map(async (file) => {
      const uploadedParams = {
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
      };

      await this.s3.send(new PutObjectCommand(uploadedParams));
      const fileUrl = `https://${this.configService.get('AWS_S3_BUCKET_NAME')}.s3.${this.configService.get('AWS_S3_REGION')}.amazonaws.com/${uploadedParams.Key}`;
      return fileUrl;
    });

    try {
      return await Promise.all(uploadedFile);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async create(files) {
    const res = await this.uploadFile(files);
    const newFiles = res.map((url) => this.assetRepository.create({ url }));
    await this.assetRepository.save(newFiles);
    return newFiles;
  }

  async findByIds(assetIds: number[]): Promise<Assets[]> {
    const assets = await this.assetRepository.find({
      where: { id: In(assetIds) },
    });
    if (assetIds.length !== assets.length)
      throw new BadRequestException('Cannot find assets!');

    return assets;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
