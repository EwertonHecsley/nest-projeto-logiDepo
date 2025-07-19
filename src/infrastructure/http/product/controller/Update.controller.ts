import { Body, Controller, HttpCode, Param, Put, Res } from '@nestjs/common';
import { UpdateProductUseCase } from 'src/applications/useCase/product/Update';
import { UpdateProductDto } from '../dto/UpdateProductDto';
import { Response } from 'express';

@Controller('/api/v1/product')
export class UpdateProductController {
  constructor(private readonly prouctService: UpdateProductUseCase) {}

  @Put(':id')
  @HttpCode(204)
  async handler(
    @Param('id') id: string,
    @Body() data: UpdateProductDto,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.prouctService.execute({ id, ...data });
    if (result.isLeft()) {
      const { message } = result.value;
      response.status(result.value.getStatus()).json({ message });
      return;
    }

    response.send();
  }
}
