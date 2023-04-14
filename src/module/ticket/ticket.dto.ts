import { IsNotEmpty } from "class-validator";

export class CreateTicketDTO {
    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    message: string;

    @IsNotEmpty()
    category: any;

    priority: any;

    @IsNotEmpty()
    fungsi: string;
}

export class TicketFilterDTO {
    subject: string;
    category: string;
    priority: string;
    fungsi: string;
    status: string;
}

export class EditStatusTicketDTO {
    @IsNotEmpty()
    status: string;
}