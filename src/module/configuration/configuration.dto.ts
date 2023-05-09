import { IsNotEmpty } from "class-validator";

export class EditBaseScheduleDTO {
    @IsNotEmpty()
    baseSchedule: string
}