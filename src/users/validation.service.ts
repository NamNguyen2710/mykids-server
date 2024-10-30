import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { Users } from './entity/users.entity';

@Injectable()
export class ValidationService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
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
      where: { id: userId, parent: { children: { studentId } } },
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
        parent: { children: { student: { history: { classId } } } },
      },
    });

    return user;
  }

  async validateParentSchoolPermission(
    userId: number,
    schoolId: number,
  ): Promise<Users | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId, parent: { schools: { id: schoolId } } },
    });

    return user;
  }

  async validateSchoolFacultyPermission(
    userId: number,
    {
      schoolId,
      classId,
      studentId,
      facultyId,
      permissionId,
    }: {
      schoolId?: number;
      classId?: number;
      studentId?: number;
      facultyId?: number;
      permissionId?: number;
    },
  ): Promise<Users | null> {
    const whereClause: FindOptionsWhere<Users> = { id: userId, isActive: true };
    if (!schoolId && !classId && !studentId && !facultyId) return null;

    if (schoolId) {
      whereClause.faculty = { schoolId };
    }
    if (classId) {
      whereClause.faculty = { assignedSchool: { classes: { id: classId } } };
    }
    if (studentId) {
      whereClause.faculty = { assignedSchool: { students: { id: studentId } } };
    }
    if (facultyId) {
      whereClause.faculty = {
        assignedSchool: { faculties: { userId: facultyId } },
      };
    }
    if (permissionId) {
      whereClause.role = { permissions: { permissionId, isActive: true } };
    }

    const user = await this.userRepository.findOne({
      where: whereClause,
      relations: ['faculty.assignedSchool'],
    });

    return user;
  }

  async validateSchoolFacultyClassPermission(
    userId: number,
    {
      classId,
      studentId,
      permissionId,
    }: { classId?: number; studentId?: number; permissionId?: number },
  ): Promise<Users | null> {
    const whereClause: FindOptionsWhere<Users> = { id: userId, isActive: true };
    if (!classId && !studentId) return null;

    if (classId) {
      whereClause.faculty = { history: { classId } };
    }
    if (studentId) {
      whereClause.faculty = {
        history: { classroom: { students: { studentId } } },
      };
    }
    if (permissionId) {
      whereClause.role = { permissions: { permissionId, isActive: true } };
    }

    const user = await this.userRepository.findOne({
      where: whereClause,
      relations: ['faculty.history.classroom'],
    });

    return user;
  }

  async validateFacultySchoolClassPermission({
    userId,
    schoolId,
    classId,
    allPermissionId,
    classPermissionId,
    schoolPermissionId,
  }: {
    userId: number;
    schoolId: number;
    classId?: number;
    allPermissionId: number;
    classPermissionId: number;
    schoolPermissionId?: number;
  }) {
    const whereClause: FindOptionsWhere<Users> = {
      id: userId,
      isActive: true,
      faculty: { schoolId },
    };
    if (classId)
      whereClause.faculty = {
        schoolId,
        assignedSchool: { classes: { id: classId } },
      };

    const user = await this.userRepository.findOne({
      where: whereClause,
      relations: ['faculty.history.classroom', 'role.permissions'],
    });

    const res = {
      user,
      allPermission: false,
      classPermission: false,
      schoolPermission: false,
    };

    if (!user) return res;

    user.role.permissions.forEach((permission) => {
      if (permission.permissionId === allPermissionId && permission.isActive)
        res.allPermission = true;
      if (permission.permissionId === classPermissionId && permission.isActive)
        res.classPermission = true;
      if (
        schoolPermissionId &&
        permission.permissionId === schoolPermissionId &&
        permission.isActive
      )
        res.schoolPermission = true;
    });

    if (res.classPermission && classId) {
      const checkClass = user.faculty.history.some(
        (history) => history.classId === classId,
      );
      if (!checkClass) res.classPermission = false;
    }

    return res;
  }
}
