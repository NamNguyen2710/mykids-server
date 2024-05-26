import { Test, TestingModule } from '@nestjs/testing';
import { CommentTaggedUserService } from './comment_tagged_user.service';

describe('CommentTaggedUserService', () => {
  let service: CommentTaggedUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentTaggedUserService],
    }).compile();

    service = module.get<CommentTaggedUserService>(CommentTaggedUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
