import { ProductRepository } from 'src/core/domain/product/repository/ProductRepository';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from 'src/core/domain/product/entity/Product';
import {
  FindAllParams,
  PaginatedResponse,
} from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { ProductPrismaMapper } from '../prisma/mappers/product/ProductPrismaMapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductPrismaRepository implements ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(entity: Product): Promise<Product> {
    const data = ProductPrismaMapper.toDatabase(entity);
    const product = await this.prismaService.product.create({ data });
    return ProductPrismaMapper.toDomain(product);
  }

  async findAll({
    page,
    limit,
  }: FindAllParams): Promise<PaginatedResponse<Product>> {
    const skip = (page - 1) * limit;

    const [products, total] = await this.prismaService.$transaction([
      this.prismaService.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.product.count(),
    ]);

    return {
      data: products.map((p) => ProductPrismaMapper.toDomain(p)),
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prismaService.product.findUnique({
      where: { id },
    });

    return product ? ProductPrismaMapper.toDomain(product) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.product.delete({
      where: { id },
    });
  }

  async save(product: Product): Promise<void> {
    const data = ProductPrismaMapper.toDatabase(product);
    await this.prismaService.product.update({
      where: { id: product.id.toString },
      data,
    });
  }
}
