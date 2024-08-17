import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1723889292667 implements MigrationInterface {
  name = 'OnDeleteCascade1723889292667';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			ALTER TABLE "comment_tagged_users"
			DROP CONSTRAINT "comment_tagged_users_comment_id_fkey"
			ADD CONSTRAINT "comment_tagged_users_comment_id_fkey" 
				FOREIGN KEY ("comment_id") 
				REFERENCES "comments"("comment_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "meals" 
			DROP CONSTRAINT "meals_menu_id_fkey"
			ADD CONSTRAINT "meals_menu_id_fkey" 
				FOREIGN KEY ("menu_id") 
				REFERENCES "menus"("menu_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "loa_image" 
			DROP CONSTRAINT "loa_image_loa_id_fkey"
			ADD CONSTRAINT "loa_image_loa_id_fkey" 
				FOREIGN KEY ("loa_id") 
				REFERENCES "loa"("loa_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "loa_image" 
			DROP CONSTRAINT "loa_image_image_id_fkey"
			ADD CONSTRAINT "loa_image_image_id_fkey" 
				FOREIGN KEY ("image_id") 
				REFERENCES "assets"("asset_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "medical_assets" 
			DROP CONSTRAINT "medical_assets_medical_id_fkey"
			ADD CONSTRAINT "medical_assets_medical_id_fkey" 
				FOREIGN KEY ("medical_id") 
				REFERENCES "medicals"("medical_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "medical_assets" 
			DROP CONSTRAINT "medical_assets_asset_id_fkey"
			ADD CONSTRAINT "medical_assets_asset_id_fkey" 
				FOREIGN KEY ("asset_id") 
				REFERENCES "assets"("asset_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "student_cvs" 
			DROP CONSTRAINT "student_cvs_student_id_fkey"
			ADD CONSTRAINT "student_cvs_student_id_fkey" 
				FOREIGN KEY ("student_id") 
				REFERENCES "students"("student_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "student_cvs" 
			DROP CONSTRAINT "student_cvs_asset_id_fkey"
			ADD CONSTRAINT "student_cvs_asset_id_fkey" 
				FOREIGN KEY ("asset_id") 
				REFERENCES "assets"("asset_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "album_assets" 
			DROP CONSTRAINT "album_assets_album_id_fkey"
			ADD CONSTRAINT "album_assets_album_id_fkey" 
				FOREIGN KEY ("album_id") 
				REFERENCES "albums"("album_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "album_assets" 
			DROP CONSTRAINT "album_assets_asset_id_fkey"
			ADD CONSTRAINT "album_assets_asset_id_fkey" 
				FOREIGN KEY ("asset_id") 
				REFERENCES "assets"("asset_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "school_parents" 
			DROP CONSTRAINT "school_parents_parent_id_fkey"
			ADD CONSTRAINT "school_parents_parent_id_fkey" 
				FOREIGN KEY ("parent_id") 
				REFERENCES "users"("user_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "school_parents" 
			DROP CONSTRAINT "school_parents_school_id_fkey"
			ADD CONSTRAINT "school_parents_school_id_fkey" 
				FOREIGN KEY ("school_id") 
				REFERENCES "schools"("school_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(
      `ALTER TABLE "meal_images" RENAME TO "meal_assets"`,
    );
    await queryRunner.query(`
			ALTER TABLE "meal_assets" 
			DROP CONSTRAINT "meal_images_image_id_fkey"
			ADD CONSTRAINT "meal_images_image_id_fkey" 
				FOREIGN KEY ("image_id") 
				REFERENCES "assets"("asset_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "meal_assets" 
			DROP CONSTRAINT "meal_images_meal_id_fkey"
			ADD CONSTRAINT "meal_images_meal_id_fkey" 
				FOREIGN KEY ("meal_id") 
				REFERENCES "meals"("meal_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "post_likes" 
			DROP CONSTRAINT "post_likes_post_id_fkey"
			ADD CONSTRAINT "post_likes_post_id_fkey" 
				FOREIGN KEY ("post_id") 
				REFERENCES "posts"("post_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "post_likes" 
			DROP CONSTRAINT "post_likes_user_id_fkey"
			ADD CONSTRAINT "post_likes_user_id_fkey" 
				FOREIGN KEY ("user_id") 
				REFERENCES "users"("user_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "posts_hashtags_relation" 
			DROP CONSTRAINT "posts_hashtags_relation_hashtag_id_fkey"
			ADD CONSTRAINT "posts_hashtags_relation_hashtag_id_fkey" 
				FOREIGN KEY ("hashtag_id") 
				REFERENCES "hashtags"("hashtag_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "posts_hashtags_relation" 
			DROP CONSTRAINT "posts_hashtags_relation_post_id_fkey"
			ADD CONSTRAINT "posts_hashtags_relation_post_id_fkey" 
				FOREIGN KEY ("post_id") 
				REFERENCES "posts"("post_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "post_assets" 
			ADD CONSTRAINT "post_assets_post_id_fkey" 
				FOREIGN KEY ("post_id") 
				REFERENCES "posts"("post_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
    await queryRunner.query(`
			ALTER TABLE "post_assets" 
			ADD CONSTRAINT "post_assets_asset_id_fkey" 
				FOREIGN KEY ("image_id") 
				REFERENCES "assets"("asset_id") 
				ON DELETE CASCADE ON UPDATE CASCADE
		`);
  }

  public async down(): Promise<void> {}
}
