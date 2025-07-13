import { Module } from '@nestjs/common';
import { FornecedorModule } from './Fornecedor/fornecedor.module';

@Module({
  imports: [FornecedorModule],
  exports: [FornecedorModule],
})
export class HttpModule {}
