import { Injectable } from '@nestjs/common';
import { CreateStudentCvDto } from './dto/create-student_cv.dto';
import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { StudentCV } from './entities/student_cv.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class StudentCvService {
  private readonly s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_ACCESS_KEY_SECRET,
    },
  });

  constructor(
    @InjectRepository(StudentCV)
    private readonly studentCVRepo: Repository<StudentCV>,
    private readonly studentService: StudentService,
  ) {}

  async uploadFileToS3(studentId: number, files: Express.Multer.File[]) {
    const student = await this.studentService.findOne(studentId, []);
    files.map(async (file) => {
      const uploadedParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ACL: ObjectCannedACL.public_read,
      };
      await this.s3Client.send(new PutObjectCommand(uploadedParams));
      const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${uploadedParams.Key}`;
      const createStudentCvDto: CreateStudentCvDto = {
        student: student,
        mimeType: file.mimetype,
        url: fileUrl,
      };

      console.log(createStudentCvDto);
      await this.createNewFile(createStudentCvDto);
    });
  }

  async createNewFile(
    createStudentCvDto: CreateStudentCvDto,
  ): Promise<StudentCV> {
    const asset = this.studentCVRepo.create(createStudentCvDto);
    return this.studentCVRepo.save(asset);
  }

  findAll() {
    return `This action returns all studentCv`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentCv`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentCv`;
  }
}
