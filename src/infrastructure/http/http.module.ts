import { Module } from '@nestjs/common';
import { FornecedorModule } from './Fornecedor/fornecedor.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [FornecedorModule, ProductModule],
  exports: [FornecedorModule, ProductModule],
})
export class HttpModule {}
