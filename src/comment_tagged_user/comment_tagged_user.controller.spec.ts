import { Test, TestingModule } from '@nestjs/testing';
import { CommentTaggedUserController } from './comment_tagged_user.controller';
import { CommentTaggedUserService } from './comment_tagged_user.service';

describe('CommentTaggedUserController', () => {
  let controller: CommentTaggedUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentTaggedUserController],
      providers: [CommentTaggedUserService],
    }).compile();

    controller = module.get<CommentTaggedUserController>(CommentTaggedUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
