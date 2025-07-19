import { Controller, Get, HttpCode, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ListAllUseCase } from 'src/applications/useCase/product/List';
import { ProductPrismaPresenter } from '../presenter/ProductPrismaPresenter';

@Controller('api/v1/product')
export class ListAllProductsController {
  constructor(private readonly productService: ListAllUseCase) {}

  @Get()
  @HttpCode(200)
  async handler(
    @Query('page') _page = 1,
    @Query('limit') _limit = 10,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.productService.execute({
      limit: _limit,
      page: _page,
    });

    if (result.isLeft()) {
      const { message } = result.value;
      response.status(result.value.getStatus()).json({ message });
      return;
    }

    const { data, limit, page, total } = result.value;

    response.json({
      message: 'Produtos listados com sucesso.',
      data: data.map((p) => ProductPrismaPresenter.toHTTP(p)),
      limit,
      page,
      total,
    });
  }
}
