/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class SignInDto{
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    public email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(50)
    public password: string;
}