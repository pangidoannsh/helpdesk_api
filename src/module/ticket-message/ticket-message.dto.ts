import { IsNotEmpty } from "class-validator";

export class CreateMessageDTO {
    @IsNotEmpty()
    content: string

    @IsNotEmpty()
    ticketId: any

    quoteTo: string
}