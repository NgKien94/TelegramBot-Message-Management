import { MessageType } from "@message-management/types"
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator"

export class CreateMessageOfQueueDto {

  @IsOptional()
  @IsString()
  fileUrl ?: string

  @IsOptional()
  @IsString()
  content ?: string

  @IsOptional()
  @IsEnum(MessageType)
  type ?: MessageType

  @IsArray()
  @IsString({each: true})
  conversationIds: string[]
}
