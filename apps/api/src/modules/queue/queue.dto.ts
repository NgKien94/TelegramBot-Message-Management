import { MessageType } from "@prisma/client"
import { IsEnum, IsOptional, IsString } from "class-validator"

export class CreateMessageOfQueueDto {

  @IsOptional()
  @IsString()
  fileUrl ?: string

  @IsOptional()
  @IsString()
  fileName ?: string

  @IsOptional()
  @IsString()
  content ?: string

  @IsOptional()
  @IsEnum(MessageType)
  type ?: MessageType

}
