import { Controller, Get, HttpCode, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { FindFornecedorUseCase } from 'src/applications/useCase/fornecedor/Find';
import { FornecedorPrismaPresenter } from '../presenter/FornecedorPrismaPresenter';

@Controller('api/v1/fornecedor')
export class FindFornecedorController {
  constructor(private readonly fornecedorService: FindFornecedorUseCase) {}

  @Get(':id')
  @HttpCode(200)
  async handler(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.fornecedorService.execute({ id });

    if (result.isLeft()) {
      const { message } = result.value;
      response.status(result.value.getStatus()).json({ message });
      return;
    }

    response.json({
      message: 'Fornecedor encontrado com sucesso',
      fornecedor: FornecedorPrismaPresenter.toHTTP(result.value),
    });
  }
}
