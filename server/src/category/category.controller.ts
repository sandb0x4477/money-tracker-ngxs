import { Controller, Get, Param, ParseIntPipe, Post, Body, Put, UseGuards } from '@nestjs/common';

import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { AuthGuard } from '../shared/auth.guard';

@Controller('category')
// @UseGuards(AuthGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  /* ---------------------------- GET ALL --------------------------- */
  @Get()
  getAll(): Promise<Category[]> {
    return this.categoryService.getAll();
  }

  /* --------------------------- GET BY ID -------------------------- */
  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoryService.getById(id);
  }

  /* ---------------------------- CREATE ---------------------------- */
  @Post()
  create(@Body() payload: Partial<Category>): Promise<Category> {
    return this.categoryService.create(payload);
  }

  /* ---------------------------- UPDATE ---------------------------- */
  @Put(':id/edit')
  update(@Param('id', ParseIntPipe) id: number, @Body() payload: Partial<Category>): Promise<Category> {
    return this.categoryService.update(id, payload);
  }

  /* ---------------------------- DELETE ---------------------------- */
  @Put(':id/delete')
  delete(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.categoryService.delete(id);
  }

  @Post('/reorder')
  sort(@Body() body: { moveFrom: number; moveTo: number }): Promise<Category[]> {
    return this.categoryService.sort(body);
  }
}
