import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty.' })
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Price must be a positive number.' })
  @IsNotEmpty({ message: 'Price cannot be empty.' })
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Quantity must be a positive number.' })
  @IsNotEmpty({ message: 'Quantity cannot be empty.' })
  quantity: number;
}
