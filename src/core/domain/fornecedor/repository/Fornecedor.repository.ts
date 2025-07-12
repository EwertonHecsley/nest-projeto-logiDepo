import { Fornecedor } from '../entity/Fornecedor';

export type FindAllParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export abstract class FornecedorRepository {
  abstract create(entity: Fornecedor): Promise<Fornecedor>;
  abstract findByCnpj(cnpj: string): Promise<Fornecedor | null>;
  abstract findByEmail(email: string): Promise<Fornecedor | null>;
  abstract findById(id: string): Promise<Fornecedor | null>;
  abstract findAll(
    params: FindAllParams,
  ): Promise<PaginatedResponse<Fornecedor>>;
  abstract delete(id: string): Promise<void>;
  abstract save(entity: Fornecedor): Promise<void>;
}
