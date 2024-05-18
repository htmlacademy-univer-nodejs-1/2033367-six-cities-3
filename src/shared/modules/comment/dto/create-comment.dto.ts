import { IsMongoId, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDTO {

  @MinLength(5, { message: '' })
  @MaxLength(1024, { message: '' })
  public text: string;

  @IsMongoId({ message: '' })
  public offerId: string;

  @IsMongoId({ message: '' })
  public userId: string;

}
