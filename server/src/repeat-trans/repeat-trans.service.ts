import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { RepeatTrans } from './repeat-trans.entity';

@Injectable()
export class RepeatTransService {
  constructor(
    @InjectRepository(RepeatTrans)
    private repeatRepo: Repository<RepeatTrans>,
  ) {}

  /* ---------------------------- GET ALL --------------------------- */
  async getRepeatTrans(): Promise<RepeatTrans[]> {
    const repeatTrans = await this.repeatRepo.find({
      order: {
        nextDate: 'ASC',
      },
    });
    return repeatTrans;
  }

  // ! BY ID
  async getById(id: number): Promise<RepeatTrans> {
    const result = await this.repeatRepo.findOne(id);

    if (!result) {
      throw new NotFoundException(`Transaction with id: ${id} not found`);
    }

    return result;
  }

  // ! ADD NEW RepeatTransaction
  async create(data: Partial<RepeatTrans>): Promise<RepeatTrans> {
    const result = this.repeatRepo.create(data);

    await this.repeatRepo.save(result);
    const transactionToReturn = await this.getById(result.id);

    return transactionToReturn;
  }

  // ! UPDATE
  async update(id: number, data: Partial<RepeatTrans>): Promise<RepeatTrans> {
    const transaction = await this.repeatRepo.findOne(id);

    if (!transaction) {
      throw new NotFoundException(`Transaction with id: ${id} not found`);
    }

    await this.repeatRepo.update({ id }, data);

    const transactionToEmit = await this.getById(id);

    return transactionToEmit;
  }

  // ! DELETE
  async delete(id: number): Promise<DeleteResult> {
    const transaction = await this.repeatRepo.findOne(id);

    if (!transaction) {
      throw new NotFoundException(`Transaction with id: ${id} not found`);
    }

    const result = await this.repeatRepo.delete(id);

    return result;
  }
}
