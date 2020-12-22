import { Controller, Get, Query, Param, ParseIntPipe, Body, Post, Delete, UseGuards } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetEntity } from './budget.entity';
import { AuthGuard } from '../shared/auth.guard';

@Controller('budget')
@UseGuards(AuthGuard)
export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  @Get()
  getBudgetForMonth(@Query() payload: { month: string }): Promise<any[]> {
    return this.budgetService.getBudgetForMonth(payload);
  }

  @Get('/:id')
  getBudgetByCategory(
    @Param('id', ParseIntPipe) id: number,
    @Query() payload: { start: string, end: string, catid: string },
  ) {
    return this.budgetService.getBudgetByCategory(id, payload);
  }

    /* ---------------------------- CREATE ---------------------------- */
    @Post()
    create(@Body() payload: Partial<BudgetEntity>): Promise<any> {
      return this.budgetService.create(payload);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<any> {
      return this.budgetService.delete(id);
    }
}
