import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Either, left, right } from 'src/shared/either';

type UpdateProps = {
  id: string;
  description?: string;
  quantity?: number;
  price?: number;
};

type UpdateResult = {
  newDescription?: string;
  newQuantity?: number;
  newPrice?: number;
};

type Response = Either<BadRequestException, UpdateResult>;

export class UpdateProductFactory {
  static validateAndCreate(props: UpdateProps): Response {
    try {
      const { description, price, quantity } = props;
      const result: UpdateResult = {};

      if (description !== undefined) {
        if (!description.trim()) {
          return left(new BadRequestException('Descrição não pode ser vazia.'));
        }
        result.newDescription = description.trim();
      }

      if (price !== undefined) {
        if (price < 0) {
          return left(new BadRequestException('Preço não pode ser negativo.'));
        }
        result.newPrice = price;
      }

      if (quantity !== undefined) {
        if (quantity < 0) {
          return left(
            new BadRequestException('Quantidade não pode ser negativa.'),
          );
        }
        result.newQuantity = quantity;
      }

      return right(result);
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        return left(error);
      }

      return left(
        new InternalServerErrorException('Erro interno ao validar o produto.'),
      );
    }
  }
}
