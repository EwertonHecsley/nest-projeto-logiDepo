import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateFornecedorDto {
  @IsString()
  @IsNotEmpty({ message: 'Campo Razao Social nao pode ser vazio.' })
  razaoSocial: string;

  @IsString()
  @IsNotEmpty({ message: 'Campo CNPJ nao pode ser vazio.' })
  cnpj: string;

  @IsString()
  @IsNotEmpty({ message: 'Campo email nao pode ser vazio.' })
  @IsEmail({}, { message: 'Formato de email invalido.' })
  email: string;
}
