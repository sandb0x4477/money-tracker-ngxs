import {
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Put,
  UseGuards,
} from '@nestjs/common';

import { AccountService } from './account.service';
import { Account } from './account.entity';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../user/user.decorator';

@Controller('account')
// @UseGuards(AuthGuard)
export class AccountController {
  constructor(private accountService: AccountService) {}

  private logger = new Logger('AccountController');

  /* ---------------------------- GET ALL --------------------------- */
  @Get()
  getAllAccount(@User('email') email: string): Promise<Account[]> {
    // console.log('TC: AccountController -> email', email);
    this.logger.log(email);
    return this.accountService.getAll();
  }

  /* --------------------------- GET BY ID -------------------------- */
  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<Account> {
    this.logger.log(JSON.stringify({ id }));

    return this.accountService.getById(id);
  }

  /* ---------------------------- CREATE ---------------------------- */
  @Post()
  create(@Body() payload: { name: string }) {
    return this.accountService.create(payload);
  }

  /* ---------------------------- UPDATE ---------------------------- */
  @Put(':id/edit')
  update(@Param('id', ParseIntPipe) id: number, @Body() payload: Partial<Account>): Promise<Account> {
    return this.accountService.update(id, payload);
  }

  @Put(':id/delete')
  delete(@Param('id', ParseIntPipe) id: number): Promise<Account> {
    return this.accountService.delete(id);
  }

  @Post('/reorder')
  sort(@Body() body: { moveFrom: number; moveTo: number }): Promise<Account[]> {
    return this.accountService.sort(body);
  }
}
