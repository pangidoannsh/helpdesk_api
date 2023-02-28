import { IsNotEmpty } from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty()
    phone: string;
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    name: string;
}

export class LoginUserDTO {
    @IsNotEmpty()
    phone: string;
    @IsNotEmpty()
    passwrod: string;
}