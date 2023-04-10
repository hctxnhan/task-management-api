import {
  IsEmail,
  IsString,
  IsStrongPassword,
  ValidateBy,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @ValidateBy({
    name: 'passwordMatch',
    validator: {
      validate: (value, args) => {
        return value === args.object['password'];
      },
      defaultMessage: () => 'Passwords do not match',
    },
  })
  confirmPassword: string;

  @IsString()
  username: string;

  @IsString()
  name: string;
}
