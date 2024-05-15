import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PostService } from 'src/post/post.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly postService: PostService,
  ) {}

  async findAll(isActive: boolean = true): Promise<Users[]> {
    return this.userRepository.find({ where: { isActive } });
  }

  async findOne(userId: number, isActive: boolean = true): Promise<Users> {
    return this.userRepository.findOne({ where: { id: userId, isActive } });
  }

  async findOneByPhone(number: string, isActive: boolean = true) {
    return this.userRepository.findOne({
      where: { phoneNumber: number, isActive },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const newuser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newuser);
  }

  async update(userId: number, user: Partial<Users>): Promise<Users> {
    await this.userRepository.update(userId, user);
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async delete(userId: number): Promise<void> {
    await this.userRepository.update(userId, { isActive: false });
  }
}
