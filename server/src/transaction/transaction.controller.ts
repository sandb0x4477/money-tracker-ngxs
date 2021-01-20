import { Controller, Get, Query, Param, ParseIntPipe, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';

import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../user/user.decorator';
import { UserEntity } from '../user/user.entity';

@Controller('transaction')
// @UseGuards(AuthGuard)
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  /* -------------------- STATS PIE CHART -------------------- */
  @Get('/stats/piechart')
  getPieChartData(@Query() payload: { start: string; end: string; incexp: string }): Promise<any> {
    return this.transactionService.statsPieChart(payload);
  }

  /* -------------------- STATS FOR MAIN CATEGORY ------------------- */
  @Get('/stats/maincat')
  getStatsMainCategory(@Query() payload: { start: string; end: string; catid: string }): Promise<any> {
    return this.transactionService.statsMainCategory(payload);
  }

  /* -------------------- STATS CATEGORY LAST TWELVE ------------------- */
  @Get('/stats/lasttwelve')
  getStatsCategoryLastTwelve(
    @Query() payload: { start: string; end: string; catid: string; maincat: string },
  ): Promise<any> {
    return this.transactionService.getStatsCategoryLastTwelve(payload);
  }

  /* ------------------------- MONTHLY STATS ------------------------ */
  @Get('/stats/monthly')
  getSummaryMonthly(@Query() payload: { start: string; end: string }): Promise<any> {
    return this.transactionService.getMonthlyStats(payload);
  }

  @Get('/category')
  getTransactionsByCategory(
    @Query() payload: { start: string; end: string; catid: string; maincat: string },
  ): Promise<Transaction[]> {
    return this.transactionService.getTransactionsByCategory(payload);
  }

  /* ------------------------- CALENDAR DATA ------------------------- */
  @Get('/calendar')
  getCalendarData(@Query() payload: { start: string; end: string }): Promise<Transaction[]> {
    return this.transactionService.getCalendarData(payload);
  }

  /* ----------------------- GET ALL BY DATES ----------------------- */
  @Get()
  getByDate(@Query() payload: { start: string; end: string }): Promise<Transaction[]> {
    return this.transactionService.getByDate(payload);
  }

  /* --------------------------- GET BY ID -------------------------- */
  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<Transaction> {
    return this.transactionService.getById(id);
  }

  /* ---------------------------- CREATE ---------------------------- */
  @Post()
  create(@User() user: UserEntity, @Body() payload: Partial<Transaction>): Promise<Transaction> {
    return this.transactionService.create(user, payload);
  }

  /* ---------------------------- UPDATE ---------------------------- */
  @Put(':id/edit')
  update(@Param('id', ParseIntPipe) id: number, @Body() payload: Partial<Transaction>): Promise<Transaction> {
    return this.transactionService.update(id, payload);
  }

  /* ---------------------------- DELETE ---------------------------- */
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.transactionService.delete(id);
  }
}
