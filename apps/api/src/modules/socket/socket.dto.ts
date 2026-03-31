import { MessageType, SenderType } from '@message-management/types';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageInGatewayDto {

  @IsOptional()
  @IsString()
  fileUrl ?: string

  @IsOptional()
  @IsString()
  content ?: string

  @IsOptional()
  @IsEnum(MessageType)
  type ?: MessageType

  @IsNotEmpty()
  @IsEnum(SenderType)
  senderType : SenderType

  @IsBoolean()
  sentByAdmin : boolean

  @IsString()
  @IsNotEmpty()
  conversationId : string
}
