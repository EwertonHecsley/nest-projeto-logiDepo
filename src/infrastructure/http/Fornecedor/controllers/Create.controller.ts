import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { CreateFornecedorUseCase } from 'src/applications/useCase/fornecedor/Create';
import { CreateFornecedorDto } from '../dto/CreateFornecedorDto';
import { Response } from 'express';
import { FornecedorPrismaPresenter } from '../presenter/FornecedorPrismaPresenter';

@Controller('api/v1/fornecedor')
export class CreateFornecedorController {
  constructor(private readonly createService: CreateFornecedorUseCase) {}

  @Post()
  @HttpCode(201)
  async handler(
    @Body() dataFornecedor: CreateFornecedorDto,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.createService.execute(dataFornecedor);
    if (result.isLeft()) {
      const { message } = result.value;
      response.status(result.value.getStatus()).json({ message });
      return;
    }

    response.json({
      message: 'Fornecedor criado com sucesso.',
      fornecedor: FornecedorPrismaPresenter.toHTTP(result.value),
    });
  }
}
