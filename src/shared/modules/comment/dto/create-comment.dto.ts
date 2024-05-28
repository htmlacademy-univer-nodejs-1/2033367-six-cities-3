import { IsMongoId, MaxLength, MinLength } from 'class-validator';
import { CreateCommentValidationMessage } from './create-comment.messages';

export class CreateCommentDTO {
  @MinLength(5, { message: CreateCommentValidationMessage.text.minLength })
  @MaxLength(1024, { message: CreateCommentValidationMessage.text.maxLength })
  public text: string;

  @IsMongoId({ message: '' })
  public offerId: string;

  public userId: string;
}
