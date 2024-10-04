import { Controller, Delete, Get, Logger, Param, Post } from '@nestjs/common';
import { LikesService } from './likes.service';
import { UserAccess } from '@zimoykin/auth';
import { Profile } from 'src/decorators/cookie.decorator';
import { IProfileCookie } from 'src/middlewares/profile-cookie.interface';

@Controller('likes')
@UserAccess()
export class LikesController {
  private readonly logger = new Logger(LikesController.name);

  constructor(private readonly service: LikesService) {}

  @Get('/:contentId')
  async getLikesByContentId(@Param('contentId') contentId: string) {
    return this.service
      .getLikesCountByContentId(contentId)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        this.logger.error(err);
        throw err;
      });
  }

  @Post('/:contentId')
  async addLike(
    @Param('contentId') contentId: string,
    @Profile() profile: IProfileCookie,
  ) {
    return this.service
      .addLike(contentId, profile.profileId)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        this.logger.error(err);
        throw err;
      });
  }

  @Delete('/:contentId')
  async deleteLike(
    @Param('contentId') contentId: string,
    @Profile() profile: IProfileCookie,
  ) {
    return this.service
      .deleteLike(contentId, profile.profileId)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        this.logger.error(err);
        throw err;
      });
  }
}
