import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import {isToday } from 'date-fns';

import { DailyData, TransactionModel } from '../../_common/app.models';

@Component({
  selector: 'app-daily-trans',
  templateUrl: './daily-trans.component.html',
  styleUrls: ['./daily-trans.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyTransComponent implements OnInit {
  @Input() day: DailyData;
  @Output() command: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  get isToday() {
    const { header } = this.day;
    return isToday(new Date(`${header.monthYear}-${header.dayOfTheMonth}`));
  }

  onTransClick(trans: TransactionModel) {
    this.command.emit(trans);
  }
}
