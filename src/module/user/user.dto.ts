import { IsNotEmpty } from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty()
    phone: string;
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    fungsiId: number;
}

export class LoginUserDTO {
    @IsNotEmpty()
    phone: string;
    @IsNotEmpty()
    password: string;
}

export class UserDTO {
    id: number;
    phone: string;
    password: string;
    name: string;
    level: string;
    isActived: boolean
}

export class UpdateUserBySupervisorDTO {
    level: string;
    isActived: boolean;
}