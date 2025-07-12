import { Fornecedor } from 'src/core/domain/fornecedor/entity/Fornecedor';
import {
  FindAllParams,
  FornecedorRepository,
  PaginatedResponse,
} from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { PrismaService } from '../prisma/prisma.service';
import { FornecedorPrismaMapper } from '../prisma/mappers/fornecedor/FornecedorPrismaMapper';

export class FornecedorPrismaRepository implements FornecedorRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(entity: Fornecedor): Promise<Fornecedor> {
    const data = FornecedorPrismaMapper.toDatabase(entity);
    const fornecedor = await this.prismaService.fornecedor.create({ data });
    return FornecedorPrismaMapper.toDomain(fornecedor);
  }

  async findAll({
    page,
    limit,
  }: FindAllParams): Promise<PaginatedResponse<Fornecedor>> {
    const skip = (page - 1) * limit;

    const [fornecedors, total] = await this.prismaService.$transaction([
      this.prismaService.fornecedor.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.fornecedor.count(),
    ]);

    return {
      data: fornecedors.map((f) => FornecedorPrismaMapper.toDomain(f)),
      total,
      page,
      limit,
    };
  }

  async findByCnpj(cnpj: string): Promise<Fornecedor | null> {
    const fornecedor = await this.prismaService.fornecedor.findUnique({
      where: { cnpj },
    });

    return fornecedor ? FornecedorPrismaMapper.toDomain(fornecedor) : null;
  }

  async findByEmail(email: string): Promise<Fornecedor | null> {
    const fornecedor = await this.prismaService.fornecedor.findUnique({
      where: { email },
    });

    return fornecedor ? FornecedorPrismaMapper.toDomain(fornecedor) : null;
  }

  async findById(id: string): Promise<Fornecedor | null> {
    const fornecedor = await this.prismaService.fornecedor.findUnique({
      where: { id },
    });

    return fornecedor ? FornecedorPrismaMapper.toDomain(fornecedor) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.fornecedor.delete({
      where: { id },
    });
  }

  async save(entity: Fornecedor): Promise<void> {
    const data = FornecedorPrismaMapper.toDatabase(entity);
    await this.prismaService.fornecedor.update({
      where: { id: entity.id.toString },
      data,
    });
  }
}
