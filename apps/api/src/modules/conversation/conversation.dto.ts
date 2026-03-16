import { ConversationStatus } from '@message-management/types';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

// export class CreateConversationDto {
//   @IsString()
//   @IsNotEmpty()
//   userId: string;

//   @IsOptional()
//   @IsEnum(ConversationStatus)
//   status: ConversationStatus;

//   @IsBoolean()
//   isReadByAdmin: boolean;
// }

export class GetConversationDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  search ?: string

  @IsOptional()
  @IsEnum(ConversationStatus)
  @IsNotEmpty()
  status ?: ConversationStatus
}

export class UpdateConversationDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userId ?: string;

  @IsOptional()
  @IsEnum(ConversationStatus)
  status ?: ConversationStatus;

  @IsOptional()
  @IsBoolean()
  isReadByAdmin ?: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastMessageId: string

  @IsOptional()
  @IsDateString()
  lastMessageAt: Date


}
