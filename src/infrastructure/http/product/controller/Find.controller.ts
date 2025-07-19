import { Controller, Get, HttpCode, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { FindProductUseCase } from 'src/applications/useCase/product/Find';
import { ProductPrismaPresenter } from '../presenter/ProductPrismaPresenter';

@Controller('api/v1/product')
export class FindProductController {
  constructor(private readonly productService: FindProductUseCase) {}

  @Get(':id')
  @HttpCode(200)
  async handler(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.productService.execute({ id });
    if (result.isLeft()) {
      const { message } = result.value;
      response.status(result.value.getStatus()).json({ message });
      return;
    }

    response.json({
      message: 'Produto encontrado com sucesso.',
      product: ProductPrismaPresenter.toHTTP(result.value),
    });
  }
}
