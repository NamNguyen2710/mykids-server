import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';

import { Permissions } from './entities/permission.entity';
import { RolePermissions } from 'src/role/entities/role-permission.entity';
import { UpdatePermissionsDto } from 'src/role/dto/update-permissions.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(RolePermissions)
    private readonly rolePermissionRepository: Repository<RolePermissions>,
    @InjectRepository(Permissions)
    private readonly permissionRepository: Repository<Permissions>,
  ) {}

  async findPermissionsByRole(roleId: number) {
    const res = await this.permissionRepository
      .createQueryBuilder('permission')
      .leftJoinAndSelect('permission.roles', 'role')
      .where('role.role_id = :roleId', { roleId })
      .orWhere('role.role_id IS NULL')
      .orderBy('permission.id', 'ASC')
      .getMany();

    return res.map((permission) => ({
      permissionId: permission.id,
      name: permission.name,
      description: permission.description,
      isActive: permission.roles.length > 0 && permission.roles[0].isActive,
    }));
  }

  async createBulkRolePermissions(roleId: number, manager: EntityManager) {
    const permissions = await this.permissionRepository.find();
    const rolePermissions = permissions.map((permission) => {
      return this.rolePermissionRepository.create({
        roleId,
        permissionId: permission.id,
        isActive: true,
      });
    });

    return manager.save(rolePermissions);
  }

  async update(roleId: number, permissions: UpdatePermissionsDto) {
    const permissionData = await this.findPermissionsByRole(roleId);

    const updatePermission = [];
    permissions.forEach(async (permission) => {
      const permissionExist = permissionData.find(
        (data) => data.permissionId === permission.permissionId,
      );

      if (permissionExist && permissionExist.isActive !== permission.isActive) {
        const newPermission = this.rolePermissionRepository.create({
          roleId,
          permissionId: permission.permissionId,
          isActive: permission.isActive,
        });
        updatePermission.push(newPermission);
      }
    });

    await this.rolePermissionRepository.save(updatePermission);
    return this.findPermissionsByRole(roleId);
  }
}
