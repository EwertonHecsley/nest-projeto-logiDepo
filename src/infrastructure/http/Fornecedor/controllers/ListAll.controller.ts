import { Controller, Get, HttpCode, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { ListAllFornecedorUseCase } from 'src/applications/useCase/fornecedor/ListAll';
import { FornecedorPrismaPresenter } from '../presenter/FornecedorPrismaPresenter';

@Controller('api/v1/fornecedor')
export class ListAllFornecedorController {
  constructor(private readonly fornecedorService: ListAllFornecedorUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query('page') _page = 1,
    @Query('limit') _limit = 10,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.fornecedorService.execute({
      limit: _limit,
      page: _page,
    });

    if (result.isLeft()) {
      const error = result.value;
      response.status(error.getStatus()).json({ message: error.message });
      return;
    }

    const { data, limit, page, total } = result.value;

    response.status(200).json({
      message: 'Fornecedores listados com sucesso.',
      data: data.map((f) => FornecedorPrismaPresenter.toHTTP(f)),
      limit,
      page,
      total,
    });
  }
}
