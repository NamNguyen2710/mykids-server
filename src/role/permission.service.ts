import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RolePermissions } from 'src/role/entities/role-permission.entity';
import { UpdatePermissionsDto } from 'src/role/dto/update-permissions.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(RolePermissions)
    private readonly permissionRepository: Repository<RolePermissions>,
  ) {}

  async findPermissionsByRole(roleId: number) {
    return this.permissionRepository.find({
      where: { roleId },
      relations: { permission: true },
      order: { permissionId: 'ASC' },
    });
  }

  async update(roleId: number, permissions: UpdatePermissionsDto) {
    const permissionData = await this.findPermissionsByRole(roleId);

    const updatePermission = [];
    permissions.forEach(async (permission) => {
      const permissionExist = permissionData.find(
        (data) => data.permissionId === permission.permissionId,
      );

      if (permissionExist && permissionExist.isActive !== permission.isActive) {
        permissionExist.isActive = permission.isActive;
        updatePermission.push(permissionExist);
      }
    });

    await this.permissionRepository.save(updatePermission);
    return this.findPermissionsByRole(roleId);
  }
}
