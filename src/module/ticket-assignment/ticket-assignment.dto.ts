import { IsNotEmpty } from "class-validator";

export class AddAgentAssignmentDTO {
    @IsNotEmpty()
    agentId: number
}