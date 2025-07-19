import { Body, Controller, HttpCode, Param, Put, Res } from '@nestjs/common';
import { UpdateFornecedorDto } from '../dto/UpdateFornecedorDto';
import { Response } from 'express';
import { UpdateFornecedorUseCase } from 'src/applications/useCase/fornecedor/Update';

@Controller('api/v1/fornecedor')
export class UpdateFornecedorController {
  constructor(private readonly fornecedorService: UpdateFornecedorUseCase) {}

  @Put(':id')
  @HttpCode(204)
  async handler(
    @Param('id') id: string,
    @Body() data: UpdateFornecedorDto,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.fornecedorService.execute({ id, ...data });

    if (result.isLeft()) {
      const { message } = result.value;
      response.status(result.value.getStatus()).json({ message });
      return;
    }

    response.send();
  }
}
