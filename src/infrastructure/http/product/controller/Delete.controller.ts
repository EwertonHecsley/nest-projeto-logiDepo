import { Controller, Delete, HttpCode, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteProductUseCase } from 'src/applications/useCase/product/Delete';

@Controller('/api/v1/product')
export class DeleteProductController {
  constructor(private readonly productService: DeleteProductUseCase) {}

  @Delete(':id')
  @HttpCode(204)
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

    response.send();
  }
}
