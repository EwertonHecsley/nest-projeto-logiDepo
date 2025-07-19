import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Campo descricao nao pode ser vazio.' })
  description: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Campo quantidade nao pode ser vazio.' })
  @Min(0, { message: 'Quantidade nao pode ser negativa.' })
  quantity: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Campo preco nao pode ser vazio.' })
  @Min(0, { message: 'Preco nao pode ser negativo.' })
  price: number;
}
