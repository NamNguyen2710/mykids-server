import { Module } from '@nestjs/common';

import { StudentModule } from 'src/student/student.module';
import { ProfileController } from './profile.controller';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [StudentModule, RoleModule],
  controllers: [ProfileController],
})
export class ProfileModule {}
