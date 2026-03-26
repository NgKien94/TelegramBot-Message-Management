import { IsNotEmpty, IsString } from "class-validator";

export class UpdateWelcomeMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string
}
