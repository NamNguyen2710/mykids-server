import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async findAll(): Promise<Users[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<Users> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneByNumber(number: string){
    return this.userRepository.findOne({where: { number }});
  }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const newuser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newuser);
  }

  async update(id: number, user: Partial<Users>): Promise<Users> {
    await this.userRepository.update(id, user);
    return this.userRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}