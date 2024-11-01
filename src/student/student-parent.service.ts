import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SchoolService } from 'src/school/school.service';
import { UserService } from 'src/users/users.service';

import { Students } from './entities/student.entity';
import { StudentsParents } from './entities/students-parents.entity';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from 'src/student/dto/update-parent.dto';

@Injectable()
export class StudentParentService {
  constructor(
    @InjectRepository(Students)
    private readonly studentRepository: Repository<Students>,
    @InjectRepository(StudentsParents)
    private readonly stdParentRepository: Repository<StudentsParents>,
    private readonly userService: UserService,
    private readonly schoolService: SchoolService,
  ) {}

  async create(studentId: number, createParentDto: CreateParentDto) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    const { id: parentId, relationship, ...parentData } = createParentDto;

    let parent;
    await this.studentRepository.manager.transaction(async (manager) => {
      if (parentId) {
        // Update existing parent
        parent = await this.userService.update(parentId, parentData, manager);

        if (!parent) throw new NotFoundException('Parent not found');
      } else {
        // Create parent
        parent = await this.userService.create(parentData, manager);
      }

      // Create student parent relation
      const parents = this.stdParentRepository.create({
        parentId: parent.id,
        studentId,
        relationship,
      });
      await manager.save(parents);

      // Add parent to school
      await this.schoolService.addParents(
        student.schoolId,
        [parent.id],
        manager,
      );
    });

    return { ...parent, relationship };
  }

  async update(
    parentId: number,
    studentId: number,
    updateParentDto: UpdateParentDto,
  ) {
    const { relationship, ...parentData } = updateParentDto;
    let parent;

    const stdParent = await this.stdParentRepository.findOne({
      where: { parentId, studentId },
    });
    if (!stdParent) throw new BadRequestException('Parent not found');

    await this.studentRepository.manager.transaction(async (manager) => {
      parent = await this.userService.update(parentId, parentData, manager);
      if (!parent) throw new BadRequestException('Parent not found');

      if (relationship) {
        stdParent.relationship = relationship;
        await manager.save(stdParent);
      }
    });

    return { ...parent, relationship };
  }

  async delete(parentId: number, studentId: number) {
    const stdParent = await this.stdParentRepository.findOne({
      where: { parentId, studentId },
      relations: { student: true },
    });
    if (!stdParent) throw new BadRequestException('Parent not found');

    await this.studentRepository.manager.transaction(async (manager) => {
      await manager.delete(StudentsParents, { parentId, studentId });
      await this.schoolService.removeParents(
        stdParent.student.schoolId,
        [parentId],
        manager,
      );
    });
  }
}
