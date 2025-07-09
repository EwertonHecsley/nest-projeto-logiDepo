import { left, right } from 'src/shared/either';
import { RequestProduct, ResponseProduct } from '../Create';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Product } from 'src/core/domain/product/entity/Product';

export class CreateProductFactory {
  static create(props: RequestProduct): ResponseProduct {
    const { description, price, quantity } = props;

    try {
      if (
        !description?.trim() ||
        price === undefined ||
        quantity === undefined
      ) {
        return left(
          new BadRequestException(
            'Descricao, preco e quantidade são obrigatorios.',
          ),
        );
      }

      if (price < 0 || quantity < 0) {
        return left(
          new BadRequestException(
            'Preco e quantidade não podem ser negativas.',
          ),
        );
      }

      const product = Product.create({ description, quantity, price });
      return right(product);
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        return left(error);
      }
      return left(
        new InternalServerErrorException('Erro interno no servidor.'),
      );
    }
  }
}
