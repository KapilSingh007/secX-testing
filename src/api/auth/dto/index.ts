import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export enum LoginMode {
  gmail,
  email,
}
export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(LoginMode)
  mode: LoginMode;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsEmail()
  email:string;
}
