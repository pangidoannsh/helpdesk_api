import { IsNotEmpty } from "class-validator";

export class CreateFungsiDTO {
    @IsNotEmpty()
    fungsiname: string;
}

export class EditFungsiDTO {
    @IsNotEmpty()
    fungsiname: string;
}