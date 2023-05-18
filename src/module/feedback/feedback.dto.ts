import { IsNotEmpty } from "class-validator";

export class CreateFeeadbackDTO {
    @IsNotEmpty()
    value: number

    @IsNotEmpty()
    ticketId: any

    comment: string
}