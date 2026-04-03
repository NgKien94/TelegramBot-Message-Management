import { MessageType, SenderType } from '@message-management/types';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageOfQueueDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fileUrls?: string[];

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @IsNotEmpty()
  @IsEnum(SenderType)
  senderType: SenderType;

  @IsString()
  @IsNotEmpty()
  sentByAdmin: string;

  @IsArray()
  @IsString({ each: true })
  conversationIds: string[];
}
