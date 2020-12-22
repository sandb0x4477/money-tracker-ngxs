import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  /* ---------------------------- GET ALL --------------------------- */
  async getAll(): Promise<Category[]> {
    const result = await this.categoryRepo.find({
      order: {
        sequence: 'ASC',
      },
    });

    return result;
  }

  /* ----------------------------- BY ID ---------------------------- */
  async getById(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne(id);

    if (!category) {
      throw new NotFoundException(`Category with id: ${id} not found`);
    }

    return category;
  }

  /* ---------------------------- CREATE ---------------------------- */
  async create(payload: Partial<Category>): Promise<Category> {
    const result = this.categoryRepo.create(payload);

    await this.categoryRepo.save(result);
    const categoryToReturn = await this.getById(result.id);

    return categoryToReturn;
  }

  /* ---------------------------- UPDATE ---------------------------- */
  async update(id: number, data: Partial<Category>): Promise<Category> {
    const category = await this.categoryRepo.findOne(id);

    if (!category) {
      throw new NotFoundException(`Category with id: ${id} not found`);
    }

    await this.categoryRepo.update({ id }, data);
    const categoryToReturn = await this.getById(id);

    return categoryToReturn;
  }

  /* ---------------------------- DELETE ---------------------------- */
  async delete(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne(id);

    if (!category) {
      throw new NotFoundException(`Category with id: ${id} not found`);
    }

    const deleted = category.deleted === false ? true : false;

    await this.categoryRepo.update({ id }, { deleted });

    const categoryToReturn = await this.getById(id);

    return categoryToReturn;
  }

  /* ---------------------------- REORDER ---------------------------- */
  async sort(data: { moveFrom: number; moveTo: number }): Promise<Category[]> {
    const { moveFrom, moveTo } = data;

    const querySql = 'SELECT * from reorder_cats_fn($1, $2)';

    const result = await this.categoryRepo.query(querySql, [moveFrom, moveTo]);

    return result.map((item: any) => {
      let rItem = {} as any;
      rItem = {
        id: item.id,
        deleted: item.deleted,
        name: item.name,
        sequence: item.sequence,
        type: item.type,
        parentId: item.parent_id,
      };
      return rItem
    });

    // return result;
  }
}
