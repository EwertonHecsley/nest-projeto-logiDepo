import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateFornecedorDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Campo Razao Social nao pode ser vazio.' })
  razaoSocial: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Campo CNPJ nao pode ser vazio.' })
  cnpj: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Campo email nao pode ser vazio.' })
  @IsEmail({}, { message: 'Formato de email invalido.' })
  email: string;
}
