/**
 * PROGRAMOWANIE OBIEKTOWE - Interfejsy
 * Definiują kontrakt dla serwisów CRUD
 */
export interface IBaseService<T, CreateDto, UpdateDto> {
  create(dto: CreateDto): Promise<T>;
  findAll(): Promise<T[]>;
  findOne(id: string): Promise<T | null>;
  update(id: string, dto: UpdateDto): Promise<T>;
  remove(id: string): Promise<T>;
}
