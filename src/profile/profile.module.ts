import { Module } from '@nestjs/common';

import { StudentModule } from 'src/student/student.module';
import { ProfileController } from './profile.controller';

@Module({
  imports: [StudentModule],
  controllers: [ProfileController],
})
export class ProfileModule {}
