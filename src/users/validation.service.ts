import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from './entity/users.entity';
import * as Role from './entity/roles.data';
import { Classrooms } from 'src/class/entities/class.entity';
import { Students } from 'src/student/entities/student.entity';

@Injectable()
export class ValidationService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Classrooms)
    private readonly classRepository: Repository<Classrooms>,
    @InjectRepository(Students)
    private readonly studentRepository: Repository<Students>,
  ) {}

  async validateUserRole(
    userId: number,
    roleId: number,
  ): Promise<Users | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId, roleId },
    });
    return user;
  }

  async validateParentChildrenPermission(
    userId: number,
    studentId: number,
  ): Promise<Users | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId, roleId: Role.Parent.id, children: { studentId } },
    });

    return user;
  }

  async validateParentClassPermission(
    userId: number,
    classId: number,
  ): Promise<Users | null> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        roleId: Role.Parent.id,
        children: { student: { history: { classId } } },
      },
    });

    return user;
  }

  async validateParentSchoolPermission(
    userId: number,
    schoolId: number,
  ): Promise<Users | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId, roleId: Role.Parent.id, schools: { id: schoolId } },
    });

    return user;
  }

  async validateSchoolAdminPermission(
    userId: number,
    schoolId: number,
  ): Promise<Users | null> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        roleId: Role.SchoolAdmin.id,
        assignedSchool: { id: schoolId },
      },
    });

    return user;
  }

  async validateSchoolAdminClassPermission(
    userId: number,
    classId: number,
  ): Promise<Users | null> {
    const classEntity = await this.classRepository.findOne({
      where: {
        id: classId,
        school: { schoolAdmin: { id: userId, roleId: Role.SchoolAdmin.id } },
      },
    });

    if (!classEntity) return null;

    // Transform class entity to user entity
    const {
      school: { schoolAdmin, ...school },
      ...classroom
    } = classEntity;

    const user = this.userRepository.create({
      ...schoolAdmin,
      assignedSchool: {
        ...school,
        classes: [classroom],
      },
    });

    return user;
  }

  async validateSchoolAdminStudentPermission(
    userId: number,
    studentId: number,
  ): Promise<Users | null> {
    const studentEntity = await this.studentRepository.findOne({
      where: {
        id: studentId,
        school: { schoolAdmin: { id: userId, roleId: Role.SchoolAdmin.id } },
      },
    });
    if (!studentEntity) return null;

    // Transform student entity to user entity
    const {
      school: { schoolAdmin, ...school },
      ...student
    } = studentEntity;
    const user = this.userRepository.create({
      ...schoolAdmin,
      assignedSchool: {
        ...school,
        students: [student],
      },
    });

    return user;
  }
}
