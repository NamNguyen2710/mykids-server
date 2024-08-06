import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

import { Images } from 'src/image/entities/image.entity';

@Injectable()
export class ImageService {
  private s3: S3;
  constructor(
    @InjectRepository(Images)
    private readonly imageRepository: Repository<Images>,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_S3_ACCESS_KEY_SECRET'),
      s3ForcePathStyle: true,
    });
  }

  async uploadFile(file) {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: `${uuid()}-${file.originalname}`,
      Body: file,
      ACL: 'public-read',
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-southeast-1',
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async create(file) {
    const res = await this.uploadFile(file);
    const newFile = this.imageRepository.create({ url: res.Location });
    await this.imageRepository.save(newFile);
    return newFile;
  }

  async remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
