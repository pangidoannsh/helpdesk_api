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
    fungsiId: any;
}

export class TicketFilterDTO {
    subject: string;
    category: string;
    priority: string;
    fungsi: string;
    status: string;
    offset: number;
    limit: number
}

export class EditTicketDTO {
    @IsNotEmpty()
    expiredAt: Date;

    @IsNotEmpty()
    status: string;
}

export class EditTicketStatusDTO {
    @IsNotEmpty()
    status: string;
}