import { IsNotEmpty } from "class-validator"

export class QueryFungsiScheduleDTO {
    fungsiId: any
}

export class CreateFungsiScheduleDTO {
    @IsNotEmpty()
    fungsiId: any
    @IsNotEmpty()
    agentId: any
}