import { IsNotEmpty } from "class-validator";

export class CreateResponsesDTO {
    @IsNotEmpty()
    text: string
}