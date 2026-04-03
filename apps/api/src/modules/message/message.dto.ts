import { MessageType, SenderType } from '@message-management/types';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
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

  @IsOptional()
  @IsString()
  sentByAdmin?: string;

  @IsString()
  @IsNotEmpty()
  conversationId: string;
}
