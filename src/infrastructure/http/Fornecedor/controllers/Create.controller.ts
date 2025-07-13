import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { CreateFornecedorUseCase } from 'src/applications/useCase/fornecedor/Create';
import { CreateFornecedorDto } from '../dto/CreateFornecedorDto';
import { Response } from 'express';
import { FornecedorPrismaPresenter } from '../presenter/FornecedorPrismaPresenter';

@Controller('/fornecedor')
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
      response.status(HttpStatus.BAD_REQUEST).json({ message });
      return;
    }

    response.json({
      message: 'Fornecedor criado com sucesso.',
      fornecedor: FornecedorPrismaPresenter.toHTTP(result.value),
    });
  }
}
