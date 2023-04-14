import { IsNotEmpty } from "class-validator";

export class CreateMessageDTO {
    // @IsNotEmpty()
    // userSend: any

    @IsNotEmpty()
    content: string

    @IsNotEmpty()
    ticketId: any

    quoteTo: string
}