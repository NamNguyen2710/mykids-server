import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { BaseNotificationService } from 'src/base-notification/base-notification.service';
import { ValidationService } from 'src/users/validation.service';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';
import { LoginGuard } from 'src/guard/login.guard';

import {
  QueryBaseNotiDto,
  QueryBaseNotiSchema,
} from './dto/query-base-notification.dto';
import {
  CreateBaseNotificationDto,
  CreateBaseNotificationSchema,
} from './dto/create-base-notification.dto';
import {
  UpdateBaseNotificationDto,
  UpdateBaseNotificationSchema,
} from './dto/update-base-notification.dto';

import {
  CREATE_NOTIFICATION_PERMISSION,
  CREATE_SCHOOL_NOTIFICATION_PERMISSION,
  CREATE_ASSIGNED_CLASS_NOTIFICATION_PERMISSION,
  READ_ALL_NOTIFICATION_PERMISSION,
  READ_SCHOOL_NOTIFICATION_PERMISSION,
  READ_ASSIGNED_CLASS_NOTIFICATION_PERMISSION,
  UPDATE_NOTIFICATION_PERMISSION,
  UPDATE_SCHOOL_NOTIFICATION_PERMISSION,
  UPDATE_ASSIGNED_CLASS_NOTIFICATION_PERMISSION,
} from 'src/role/entities/permission.data';
import { RequestWithUser } from 'src/utils/request-with-user';

@UseGuards(LoginGuard)
@Controller('base-notification')
export class BaseNotificationController {
  constructor(
    private readonly baseNotiService: BaseNotificationService,
    private readonly validationService: ValidationService,
  ) {}

  @Post('')
  async create(
    @Request() request: RequestWithUser,
    @Body(new ZodValidationPipe(CreateBaseNotificationSchema))
    sendNotificationDto: CreateBaseNotificationDto,
  ) {
    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: request.user.faculty?.schoolId,
        classId: sendNotificationDto.classId,
        allPermissionId: CREATE_NOTIFICATION_PERMISSION,
        classPermissionId: CREATE_ASSIGNED_CLASS_NOTIFICATION_PERMISSION,
        schoolPermissionId: CREATE_SCHOOL_NOTIFICATION_PERMISSION,
      });

    if (!permission.allPermission && !permission.classPermission)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    sendNotificationDto.schoolId = request.user.faculty.schoolId;
    return this.baseNotiService.create(sendNotificationDto);
  }

  @Get()
  async findAll(
    @Request() request: RequestWithUser,
    @Query(new ZodValidationPipe(QueryBaseNotiSchema))
    query: QueryBaseNotiDto,
  ) {
    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: request.user.faculty.schoolId,
        classId: query.classId,
        allPermissionId: READ_ALL_NOTIFICATION_PERMISSION,
        classPermissionId: READ_ASSIGNED_CLASS_NOTIFICATION_PERMISSION,
        schoolPermissionId: READ_SCHOOL_NOTIFICATION_PERMISSION,
      });

    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    const notis = await this.baseNotiService.findAll(query);
    return notis;
  }

  @Get(':baseNotiId')
  async findOne(
    @Request() request: RequestWithUser,
    @Param('baseNotiId', ParseIntPipe) baseNotiId: number,
  ) {
    const noti = await this.baseNotiService.findOne(baseNotiId);
    if (!noti) throw new BadRequestException('Notification not found');

    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: noti.schoolId,
        classId: noti.classId,
        allPermissionId: READ_SCHOOL_NOTIFICATION_PERMISSION,
        classPermissionId: READ_ASSIGNED_CLASS_NOTIFICATION_PERMISSION,
      });
    if (
      !permission.allPermission &&
      (!noti.classId || !permission.classPermission)
    )
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    return noti;
  }

  @Put(':baseNotiId')
  async update(
    @Request() request: RequestWithUser,
    @Param('baseNotiId', ParseIntPipe) baseNotiId: number,
    @Body(new ZodValidationPipe(UpdateBaseNotificationSchema))
    updateNotiDto: UpdateBaseNotificationDto,
  ) {
    const noti = await this.baseNotiService.findOne(baseNotiId);
    if (!noti) throw new BadRequestException('Notification not found');

    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: noti.schoolId,
        classId: noti.classId,
        allPermissionId: UPDATE_NOTIFICATION_PERMISSION,
        classPermissionId: UPDATE_ASSIGNED_CLASS_NOTIFICATION_PERMISSION,
        schoolPermissionId: UPDATE_SCHOOL_NOTIFICATION_PERMISSION,
      });
    if (
      !permission.allPermission &&
      (!noti.classId || !permission.classPermission)
    )
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    const newNoti = await this.baseNotiService.update(
      baseNotiId,
      updateNotiDto,
    );

    return newNoti;
  }
}
