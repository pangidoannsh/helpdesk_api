import { IsNotEmpty } from "class-validator"

export class FaqQueryDTO {
    subject: string
}

export class CreateFaqDTO {
    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    description: string;
}