import { Expose, Type } from 'class-transformer';
import { UserRDO } from '../../user/rdo/user.rdo';

export class CommentRDO {

  @Expose()
  public text: string;

  @Expose()
  public postDate: string;

  @Expose()
  public rating: number;

  @Expose({ name: 'userId' })
  @Type(() => UserRDO)
  public user: UserRDO;

}
