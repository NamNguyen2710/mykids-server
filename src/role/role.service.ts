import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Roles } from './entities/roles.entity';
import { Permissions } from './entities/permission.entity';
import { RolePermissions } from 'src/role/entities/role-permission.entity';
import { AppClientsRole } from 'src/auth/entities/client_role.entity';
import { CreateRoleDto } from 'src/role/dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,
    @InjectRepository(RolePermissions)
    private readonly rolePermissionsRepository: Repository<RolePermissions>,
    @InjectRepository(AppClientsRole)
    private readonly clientRoleRepository: Repository<AppClientsRole>,
  ) {}

  async findAll(schoolId: number) {
    return this.roleRepository.find({ where: { schoolId } });
  }

  async findOne(id: number) {
    return this.roleRepository.findOne({
      where: { id },
      relations: ['users'],
      order: { users: { firstName: 'ASC', lastName: 'ASC' } },
    });
  }

  async create(role: CreateRoleDto) {
    const newRole = this.roleRepository.create(role);

    await this.roleRepository.manager.transaction(async (manager) => {
      await this.roleRepository.save(newRole);

      await this.createBulkRolePermissions(newRole.id, manager);

      const clientRole = this.clientRoleRepository.create({
        clientId: 'SADMIN',
        roleId: newRole.id,
      });
      await manager.save(clientRole);
    });

    return newRole;
  }

  async update(id: number, roleName: string) {
    const res = await this.roleRepository.update(id, { name: roleName });
    if (res.affected === 0) return null;

    return this.roleRepository.findOne({ where: { id } });
  }

  async delete(id: number) {
    const res = await this.roleRepository.delete(id);
    if (res.affected === 0) throw new BadRequestException('Role not found');
  }

  private async createBulkRolePermissions(
    roleId: number,
    manager: EntityManager,
  ) {
    const permissions = await this.permissionsRepository.find();
    const rolePermissions = permissions.map((permission) => {
      return this.rolePermissionsRepository.create({
        roleId,
        permissionId: permission.id,
        isActive: true,
      });
    });

    return manager.save(rolePermissions);
  }
}
