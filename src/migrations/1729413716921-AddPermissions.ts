import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPermissions1729413716921 implements MigrationInterface {
  name = 'AddPermissions1729413716921';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO permissions (permission_id, name, description, type, parent_id) VALUES
      (1, 'ROLE_PERMISSIONS', 'Role permissions', 'title', NULL),
      (2, 'CREATE_ROLE_PERMISSION', 'Permission to create roles', 'create', 1),
      (3, 'READ_ROLE_PERMISSION', 'Permission to read roles', 'read', 1),
      (4, 'UPDATE_ROLE_PERMISSION', 'Permission to update roles', 'update', 1),
      (5, 'DELETE_ROLE_PERMISSION', 'Permission to delete roles', 'delete', 1),

      (6, 'PERMISSION_PERMISSIONS', 'Permission permissions', 'title', NULL),
      (7, 'READ_PERMISSION_PERMISSION', 'Permission to read permissions', 'read', 6),
      (8, 'UPDATE_PERMISSION_PERMISSION', 'Permission to update permissions', 'update', 6),

      (9, 'SCHOOL_YEAR_PERMISSIONS', 'School year permissions', 'title', NULL),
      (10, 'CREATE_SCHOOL_YEAR_PERMISSION', 'Permission to create school years', 'create', 9),
      (11, 'READ_ALL_SCHOOL_YEAR_PERMISSION', 'Permission to read all school years', 'read', 9),
      (12, 'UPDATE_SCHOOL_YEAR_PERMISSION', 'Permission to update school years', 'update', 9),
      (13, 'DELETE_SCHOOL_YEAR_PERMISSION', 'Permission to delete school years', 'delete', 9),

      (14, 'STUDENT_PERMISSIONS', 'Student permissions', 'title', NULL),
      (15, 'CREATE_STUDENT_PERMISSION', 'Permission to create students', 'create', 14),
      (16, 'READ_ALL_STUDENT_PERMISSION', 'Permission to read all students', 'read', 14),
      (17, 'UPDATE_STUDENT_PERMISSION', 'Permission to update students', 'update', 14),
      (18, 'DELETE_STUDENT_PERMISSION', 'Permission to delete students', 'delete', 14),

      (19, 'PARENT_PERMISSIONS', 'Parent permissions', 'title', NULL),
      (20, 'CREATE_PARENT_PERMISSION', 'Permission to create parents', 'create', 19),
      (21, 'READ_ALL_PARENT_PERMISSION', 'Permission to read all parents', 'read', 19),
      (22, 'UPDATE_PARENT_PERMISSION', 'Permission to update parents', 'update', 19),
      (23, 'DELETE_PARENT_PERMISSION', 'Permission to delete parents', 'delete', 19),

      (24, 'SCHOOL_FACULTY_PERMISSIONS', 'School faculty permissions', 'title', NULL),
      (25, 'CREATE_SCHOOL_FACULTY_PERMISSION', 'Permission to create school faculties', 'create', 24),
      (26, 'READ_ALL_SCHOOL_FACULTY_PERMISSION', 'Permission to read school faculties', 'read', 24),
      (27, 'UPDATE_SCHOOL_FACULTY_PERMISSION', 'Permission to update school faculties', 'update', 24),
      (28, 'DELETE_SCHOOL_FACULTY_PERMISSION', 'Permission to delete school faculties', 'delete', 24),

      (29, 'CLASS_PERMISSIONS', 'Class permissions', 'title', NULL),
      (30, 'CREATE_CLASS_PERMISSION', 'Permission to create classes', 'create', 29),
      (31, 'READ_ALL_CLASS_PERMISSION', 'Permission to read all classes', 'read', 29),
      (32, 'UPDATE_CLASS_PERMISSION', 'Permission to update classes', 'update', 29),
      (33, 'DELETE_CLASS_PERMISSION', 'Permission to delete classes', 'delete', 29),

      (34, 'ASSIGNED_CLASS_PERMISSIONS', 'Assigned class permissions', 'title', NULL),
      (35, 'READ_ASSIGNED_CLASS_PERMISSION', 'Permission to read assigned classes', 'read', 34),
      (36, 'UPDATE_ASSIGNED_CLASS_PERMISSION', 'Permission to update assigned classes', 'update', 34),
      (37, 'DELETE_ASSIGNED_CLASS_PERMISSION', 'Permission to delete assigned classes', 'delete', 34),

      (38, 'CLASS_STUDENT_PERMISSIONS', 'Class student permissions', 'title', NULL),
      (39, 'ADD_CLASS_STUDENT_PERMISSION', 'Permission to add students to classes', 'create', 38),
      (40, 'UPDATE_CLASS_STUDENT_PERMISSION', 'Permission to update class students', 'update', 38),
      (41, 'REMOVE_CLASS_STUDENT_PERMISSION', 'Permission to remove students from classes', 'delete', 38),

      (42, 'ASSIGNED_CLASS_STUDENT_PERMISSIONS', 'Assigned class student permissions', 'title', NULL),
      (43, 'ADD_ASSIGNED_CLASS_STUDENT_PERMISSION', 'Permission to add students to assigned classes', 'create', 42),
      (44, 'READ_ASSIGNED_CLASS_STUDENT_PERMISSION', 'Permission to read assigned class students', 'read', 42),
      (45, 'UPDATE_ASSIGNED_CLASS_STUDENT_PERMISSION', 'Permission to update assigned class students', 'update', 42),
      (46, 'REMOVE_ASSIGNED_CLASS_STUDENT_PERMISSION', 'Permission to remove students from assigned classes', 'delete', 42),

      (47, 'CLASS_FACULTY_PERMISSIONS', 'Class faculty permissions', 'title', NULL),
      (48, 'ADD_CLASS_FACULTY_PERMISSION', 'Permission to add faculty to classes', 'create', 47),
      (49, 'REMOVE_CLASS_FACULTY_PERMISSION', 'Permission to remove faculty from classes', 'delete', 47),

      (50, 'CLASS_HISTORY_PERMISSIONS', 'Class history permissions', 'title', NULL),
      (51, 'DELETE_CLASS_HISTORY_PERMISSION', 'Permission to delete class history', 'delete', 50),
      (52, 'WORK_HISTORY_PERMISSIONS', 'Work history permissions', 'title', NULL),
      (53, 'DELETE_WORK_HISTORY_PERMISSION', 'Permission to delete work history', 'delete', 52),

      (54, 'CLASS_SCHEDULE_PERMISSIONS', 'Class schedule permissions', 'title', NULL),
      (55, 'CREATE_CLASS_SCHEDULE_PERMISSION', 'Permission to create class schedules', 'create', 54),
      (56, 'READ_ALL_CLASS_SCHEDULE_PERMISSION', 'Permission to read class schedules', 'read', 54),
      (57, 'UPDATE_CLASS_SCHEDULE_PERMISSION', 'Permission to update class schedules', 'update', 54),
      (58, 'DELETE_CLASS_SCHEDULE_PERMISSION', 'Permission to delete class schedules', 'delete', 54),

      (59, 'ASSIGNED_CLASS_SCHEDULE_PERMISSIONS', 'Assigned class schedule permissions', 'title', NULL),
      (60, 'CREATE_ASSIGNED_CLASS_SCHEDULE_PERMISSION', 'Permission to create assigned class schedules', 'create', 59),
      (61, 'READ_ASSIGNED_CLASS_SCHEDULE_PERMISSION', 'Permission to read assigned class schedules', 'read', 59),
      (62, 'UPDATE_ASSIGNED_CLASS_SCHEDULE_PERMISSION', 'Permission to update assigned class schedules', 'update', 59),
      (63, 'DELETE_ASSIGNED_CLASS_SCHEDULE_PERMISSION', 'Permission to delete assigned class schedules', 'delete', 59),

      (64, 'CLASS_MENU_PERMISSIONS', 'Class menu permissions', 'title', NULL),
      (65, 'CREATE_CLASS_MENU_PERMISSION', 'Permission to create class menus', 'create', 64),
      (66, 'READ_ALL_CLASS_MENU_PERMISSION', 'Permission to read class menus', 'read', 64),
      (67, 'UPDATE_CLASS_MENU_PERMISSION', 'Permission to update class menus', 'update', 64),
      (68, 'DELETE_CLASS_MENU_PERMISSION', 'Permission to delete class menus', 'delete', 64),

      (69, 'ASSIGNED_CLASS_MENU_PERMISSIONS', 'Assigned class menu permissions', 'title', NULL),
      (70, 'CREATE_ASSIGNED_CLASS_MENU_PERMISSION', 'Permission to create assigned class menus', 'create', 69),
      (71, 'READ_ASSIGNED_CLASS_MENU_PERMISSION', 'Permission to read assigned class menus', 'read', 69),
      (72, 'UPDATE_ASSIGNED_CLASS_MENU_PERMISSION', 'Permission to update assigned class menus', 'update', 69),
      (73, 'DELETE_ASSIGNED_CLASS_MENU_PERMISSION', 'Permission to delete assigned class menus', 'delete', 69),

      (74, 'LOA_PERMISSIONS', 'Leave of absence permissions', 'title', NULL),
      (75, 'READ_LOA_PERMISSION', 'Permission to read leave of absence', 'read', 74),
      (76, 'UPDATE_LOA_PERMISSION', 'Permission to update leave of absence', 'update', 74),

      (77, 'ASSIGNED_CLASS_LOA_PERMISSIONS', 'Assigned class leave of absence permissions', 'title', NULL),
      (78, 'READ_ASSIGNED_CLASS_LOA_PERMISSION', 'Permission to read assigned class leave of absence', 'read', 77),
      (79, 'UPDATE_ASSIGNED_CLASS_LOA_PERMISSION', 'Permission to update assigned class leave of absence', 'update', 77),

      (80, 'ALBUM_PERMISSIONS', 'Album permissions', 'title', NULL),
      (81, 'CREATE_ALBUM_PERMISSION', 'Permission to create albums', 'create', 80),
      (82, 'READ_ALL_ALBUM_PERMISSION', 'Permission to read all albums', 'read', 80),
      (83, 'UPDATE_ALBUM_PERMISSION', 'Permission to update albums', 'update', 80),
      (84, 'DELETE_ALBUM_PERMISSION', 'Permission to delete albums', 'delete', 80),

      (85, 'SCHOOL_ALBUM_PERMISSIONS', 'School album permissions', 'title', NULL),
      (86, 'CREATE_SCHOOL_ALBUM_PERMISSION', 'Permission to create school albums', 'create', 85),
      (87, 'READ_SCHOOL_ALBUM_PERMISSION', 'Permission to read school albums', 'read', 85),
      (88, 'UPDATE_SCHOOL_ALBUM_PERMISSION', 'Permission to update school albums', 'update', 85),
      (89, 'DELETE_SCHOOL_ALBUM_PERMISSION', 'Permission to delete school albums', 'delete', 85),

      (90, 'ASSIGNED_CLASS_ALBUM_PERMISSIONS', 'Assigned class album permissions', 'title', NULL),
      (91, 'CREATE_ASSIGNED_CLASS_ALBUM_PERMISSION', 'Permission to create assigned class albums', 'create', 90),
      (92, 'READ_ASSIGNED_CLASS_ALBUM_PERMISSION', 'Permission to read assigned class albums', 'read', 90),
      (93, 'UPDATE_ASSIGNED_CLASS_ALBUM_PERMISSION', 'Permission to update assigned class albums', 'update', 90),
      (94, 'DELETE_ASSIGNED_CLASS_ALBUM_PERMISSION', 'Permission to delete assigned class albums', 'delete', 90),

      (95, 'SCHOOL_ASSETS_PERMISSIONS', 'School assets permissions', 'title', NULL),
      (96, 'READ_SCHOOL_ASSETS_PERMISSION', 'Permission to read school assets', 'read', 95),

      (97, 'SCHOOL_PERMISSIONS', 'School permissions', 'title', NULL),
      (98, 'UPDATE_SCHOOL_PERMISSION', 'Permission to update school', 'update', 97),

      (99, 'POST_PERMISSIONS', 'Post permissions', 'title', NULL),
      (100, 'CREATE_POST_PERMISSION', 'Permission to create posts', 'create', 99),
      (101, 'READ_ALL_POST_PERMISSION', 'Permission to read all posts', 'read', 99),
      (102, 'UPDATE_POST_PERMISSION', 'Permission to update posts', 'update', 99),
      (103, 'DELETE_POST_PERMISSION', 'Permission to delete posts', 'delete', 99),

      (104, 'SCHOOL_POST_PERMISSIONS', 'School post permissions', 'title', NULL),
      (105, 'CREATE_SCHOOL_POST_PERMISSION', 'Permission to create school posts', 'create', 104),
      (106, 'READ_SCHOOL_POST_PERMISSION', 'Permission to read school posts', 'read', 104),
      (107, 'UPDATE_SCHOOL_POST_PERMISSION', 'Permission to update school posts', 'update', 104),
      (108, 'DELETE_SCHOOL_POST_PERMISSION', 'Permission to delete school posts', 'delete', 104),

      (109, 'ASSIGNED_CLASS_POST_PERMISSIONS', 'Assigned class post permissions', 'title', NULL),
      (110, 'CREATE_ASSIGNED_CLASS_POST_PERMISSION', 'Permission to create assigned class posts', 'create', 109),
      (111, 'READ_ASSIGNED_CLASS_POST_PERMISSION', 'Permission to read assigned class posts', 'read', 109),
      (112, 'UPDATE_ASSIGNED_CLASS_POST_PERMISSION', 'Permission to update assigned class posts', 'update', 109),
      (113, 'DELETE_ASSIGNED_CLASS_POST_PERMISSION', 'Permission to delete assigned class posts', 'delete', 109),

      (114, 'COMMENT_PERMISSIONS', 'Comment permissions', 'title', NULL),
      (115, 'CREATE_COMMENT_PERMISSION', 'Permission to create comments', 'create', 114),
      (116, 'READ_ALL_COMMENT_PERMISSION', 'Permission to read all comments', 'read', 114),
      (117, 'UPDATE_COMMENT_PERMISSION', 'Permission to update comments', 'update', 114),
      (118, 'DELETE_COMMENT_PERMISSION', 'Permission to delete comments', 'delete', 114),

      (119, 'SCHOOL_POST_COMMENT_PERMISSIONS', 'School post comment permissions', 'title', NULL),
      (120, 'CREATE_SCHOOL_POST_COMMENT_PERMISSION', 'Permission to create school post comments', 'create', 119),
      (121, 'READ_SCHOOL_POST_COMMENT_PERMISSION', 'Permission to read school post comments', 'read', 119),
      (122, 'UPDATE_SCHOOL_POST_COMMENT_PERMISSION', 'Permission to update school post comments', 'update', 119),
      (123, 'DELETE_SCHOOL_POST_COMMENT_PERMISSION', 'Permission to delete school post comments', 'delete', 119),

      (124, 'ASSIGNED_CLASS_POST_COMMENT_PERMISSIONS', 'Assigned class post comment permissions', 'title', NULL),
      (125, 'CREATE_ASSIGNED_CLASS_POST_COMMENT_PERMISSION', 'Permission to create assigned class post comments', 'create', 124),
      (126, 'READ_ASSIGNED_CLASS_POST_COMMENT_PERMISSION', 'Permission to read assigned class post comments', 'read', 124),
      (127, 'UPDATE_ASSIGNED_CLASS_POST_COMMENT_PERMISSION', 'Permission to update assigned class post comments', 'update', 124),
      (128, 'DELETE_ASSIGNED_CLASS_POST_COMMENT_PERMISSION', 'Permission to delete assigned class post comments', 'delete', 124),

      (129, 'NOTIFICATION_PERMISSIONS', 'Notification permissions', 'title', NULL),
      (130, 'CREATE_NOTIFICATION_PERMISSION', 'Permission to create notifications', 'create', 129),
      (131, 'READ_ALL_NOTIFICATION_PERMISSION', 'Permission to read all notifications', 'read', 129),
      (132, 'UPDATE_NOTIFICATION_PERMISSION', 'Permission to update notifications', 'update', 129),
      (133, 'DELETE_NOTIFICATION_PERMISSION', 'Permission to delete notifications', 'delete', 129),

      (134, 'SCHOOL_NOTIFICATION_PERMISSIONS', 'School notification permissions', 'title', NULL),
      (135, 'READ_SCHOOL_NOTIFICATION_PERMISSION', 'Permission to read school notifications', 'read', 134),
      (136, 'CREATE_SCHOOL_NOTIFICATION_PERMISSION', 'Permission to create school notifications', 'create', 134),
      (137, 'UPDATE_SCHOOL_NOTIFICATION_PERMISSION', 'Permission to update school notifications', 'update', 134),

      (138, 'ASSIGNED_CLASS_NOTIFICATION_PERMISSIONS', 'Assigned class notification permissions', 'title', NULL),
      (139, 'READ_ASSIGNED_CLASS_NOTIFICATION_PERMISSION', 'Permission to read assigned class notifications', 'read', 138),
      (140, 'CREATE_ASSIGNED_CLASS_NOTIFICATION_PERMISSION', 'Permission to create assigned class notifications', 'create', 138),
      (141, 'UPDATE_ASSIGNED_CLASS_NOTIFICATION_PERMISSION', 'Permission to update assigned class notifications', 'update', 138),

      (142, 'MEDICAL_PERMISSIONS', 'Medical permissions', 'title', NULL),
      (143, 'READ_MEDICAL_PERMISSION', 'Permission to read medical information', 'read', 142),

      (144, 'ASSIGNED_CLASS_MEDICAL_PERMISSIONS', 'Assigned class medical permissions', 'title', NULL),
      (145, 'READ_ASSIGNED_CLASS_MEDICAL_PERMISSION', 'Permission to read assigned class medical information', 'read', 144);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM permissions WHERE permission_id BETWEEN 1 AND 1000`,
    );
  }
}
