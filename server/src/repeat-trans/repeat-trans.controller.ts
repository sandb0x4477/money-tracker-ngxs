import { Controller, Get, UseGuards, Post, Body, Put, Param, ParseIntPipe, Delete } from '@nestjs/common';

import { RepeatTransService } from './repeat-trans.service';
import { AuthGuard } from '../shared/auth.guard';
import { RepeatTrans } from './repeat-trans.entity';
import { DeleteResult } from 'typeorm';

@Controller('repeat')
@UseGuards(AuthGuard)
export class RepeatTransController {
  constructor(private repeatService: RepeatTransService) {}

  @Get()
  getRepeatTrans(): Promise<RepeatTrans[]> {
    return this.repeatService.getRepeatTrans();
  }

  @Post()
  create(@Body() body: Partial<RepeatTrans>): Promise<RepeatTrans> {
    return this.repeatService.create(body);
  }

  @Put(':id/edit')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<RepeatTrans>): Promise<RepeatTrans> {
    return this.repeatService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.repeatService.delete(id);
  }
}

