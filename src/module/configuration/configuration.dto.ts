import { IsNotEmpty } from "class-validator";

export class EditBaseScheduleDTO {
    @IsNotEmpty()
    baseSchedule: string
}

export class UpdateConfiguration {
    @IsNotEmpty()
    baseSchedule: string

    @IsNotEmpty()
    systemMode: string

    @IsNotEmpty()
    isSendWhatsapp: boolean

    @IsNotEmpty()
    isSendEmail: boolean

    @IsNotEmpty()
    ticketDeadline: number
}