import { IsNotEmpty, IsNumberString, Matches } from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty()
    phone: string;
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    fungsiId: number;
    @IsNotEmpty()
    level: string;
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
}

export class UpdateUserProfileDTO {
    @IsNotEmpty()
    @IsNumberString()
    phone: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    level: string;

    @IsNotEmpty()
    fungsiId: number;

}