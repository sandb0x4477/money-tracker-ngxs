import { Injectable, Logger, NotFoundException, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Account } from './account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
  ) {}

  private logger = new Logger('AccountService');

  /* ---------------------------- GET ALL --------------------------- */
  async getAll(): Promise<Account[]> {
    const accounts = await this.accountRepo.find({
      // order: {
      //   sequence: 'ASC',
      // },
    });
    // this.logger.log(accounts);
    return accounts;
  }

  /* --------------------------- GET BY ID -------------------------- */
  async getById(id: number): Promise<Account> {
    const account = await this.accountRepo.findOne(id);
    // this.logger.log(account);

    if (!account) {
      throw new NotFoundException(`Account with id: ${id} not found`);
    }

    return account;
  }

  /* ---------------------------- CREATE ---------------------------- */
  async create(payload: { name: string }): Promise<Account | HttpException> {
    this.logger.log(payload);

    const accountExists = await this.accountRepo.findOne({
      where: {
        name: payload.name,
      },
    });

    this.logger.log(accountExists);

    if (accountExists) throw new HttpException('Account already exists', HttpStatus.BAD_REQUEST);

    const account = this.accountRepo.create(payload);

    await this.accountRepo.save(account);

    return account;
  }

  /* ---------------------------- UPDATE ---------------------------- */
  async update(id: number, payload: Partial<Account>): Promise<Account> {
    const account = await this.accountRepo.findOne(id);

    if (!account) {
      throw new NotFoundException(`Account with id: ${id} not found`);
    }

    await this.accountRepo.update({ id }, payload);

    const accountToReturn = await this.getById(id);

    return accountToReturn;
  }

  /* ---------------------------- DELETE ---------------------------- */
  async delete(id: number): Promise<Account> {
    const account = await this.accountRepo.findOne(id);

    if (!account) {
      throw new NotFoundException(`Account with id: ${id} not found`);
    }

    const deleted = account.deleted === false ? true : false;

    await this.accountRepo.update({ id }, { deleted });

    const accountToReturn = await this.getById(id);

    return accountToReturn;
  }

  /* ---------------------------- REORDER ---------------------------- */
  async sort(data: { moveFrom: number; moveTo: number }): Promise<Account[]> {
    const { moveFrom, moveTo } = data;

    const querySql = 'SELECT * from reorder_accounts_fn($1, $2)';

    const result = await this.accountRepo.query(querySql, [moveFrom, moveTo]);

    return result;
  }
}
