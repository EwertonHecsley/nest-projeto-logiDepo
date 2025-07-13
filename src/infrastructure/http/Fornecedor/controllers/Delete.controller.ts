import { Controller, Delete, HttpCode, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteFornecedorUseCase } from 'src/applications/useCase/fornecedor/Delete';

@Controller('/fornecedor')
export class DeleteFornecedorController {
  constructor(private readonly fornecedorService: DeleteFornecedorUseCase) {}

  @Delete(':id')
  @HttpCode(204)
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

    response.send();
  }
}
