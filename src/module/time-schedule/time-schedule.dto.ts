import { IsNotEmpty } from "class-validator";

export class AddAgentOnSchedule {
    @IsNotEmpty()
    agentId: any

    @IsNotEmpty()
    dutyTime: any
}

export class QueryGetSchedule {
    month: any
    year: any
}