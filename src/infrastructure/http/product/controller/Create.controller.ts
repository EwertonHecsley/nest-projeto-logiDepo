import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { CreateProductUseCase } from 'src/applications/useCase/product/Create';
import { CreateProductDto } from '../dto/CreateProductDto';
import { Response } from 'express';
import { ProductPrismaPresenter } from '../presenter/ProductPrismaPresenter';

@Controller('/product')
export class CreateProductController {
  constructor(private readonly productService: CreateProductUseCase) {}

  @Post()
  @HttpCode(201)
  async handler(
    @Body() dataProduct: CreateProductDto,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.productService.execute(dataProduct);
    if (result.isLeft()) {
      const { message } = result.value;
      response.status(result.value.getStatus()).json({ message });
      return;
    }

    response.json({
      message: 'Produto criado com sucesso.',
      product: ProductPrismaPresenter.toHTTP(result.value),
    });
  }
}
