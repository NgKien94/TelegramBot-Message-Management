import { MessageType } from "@message-management/types"
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateMessageOfNewQueueDto {

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fileUrls?: string[];

  @IsOptional()
  @IsString()
  content ?: string

  @IsOptional()
  @IsEnum(MessageType)
  type ?: MessageType

  @IsString()
  @IsNotEmpty()
  sentByAdmin: string

  @IsArray()
  @IsString({each: true})
  conversationIds: string[]
}
