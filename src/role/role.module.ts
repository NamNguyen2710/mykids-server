import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleController } from 'src/role/role.controller';
import { RoleService } from 'src/role/role.service';
import { PermissionService } from 'src/role/permission.service';

import { Roles } from 'src/role/entities/roles.entity';
import { Permissions } from 'src/role/entities/permission.entity';
import { AppClientsRole } from 'src/auth/entities/client_role.entity';
import { RolePermissions } from 'src/role/entities/role-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Roles,
      Permissions,
      RolePermissions,
      AppClientsRole,
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService, PermissionService],
  exports: [RoleService],
})
export class RoleModule {}
