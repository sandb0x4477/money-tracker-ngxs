import { Component, Input, OnInit } from '@angular/core';
import {
  addDays,
  addMonths,
  format,
  getDate,
  isSameMonth,
  isSunday,
  isToday,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-date-picker-popup',
  templateUrl: './date-picker-popup.component.html',
  styleUrls: ['./date-picker-popup.component.scss'],
})
export class DatePickerPopupComponent implements OnInit {
  @Input() fullDate = new Date();
  isSelected: Date;
  weekStartsOn: any = 1;
  daycells: any[] = [];
  weekDays: string[] = [];

  constructor(private popoverCtrl: PopoverController) {}

  ngOnInit() {
    this.isSelected = this.fullDate;
    this.populateCellDays();
    this.populateWeekDays();
  }

  populateWeekDays() {
    const startDate = startOfWeek(this.fullDate, { weekStartsOn: this.weekStartsOn });
    for (let i = 0; i < 7; i++) {
      this.weekDays.push(format(addDays(startDate, i), 'EEE'));
    }
  }

  populateCellDays() {
    this.daycells = [];
    const firstDay = startOfWeek(startOfMonth(this.fullDate), { weekStartsOn: this.weekStartsOn });
    for (let i = 0; i < 42; i++) {

      const day: any = {
        cellDay: getDate(addDays(firstDay, i)),
        cellDate: format(addDays(firstDay, i), 'yyyy-MM-dd'),
        isToday: isToday(addDays(firstDay, i)),
        isSelected: format(addDays(firstDay, i), 'yyyy-MM-dd') === format(this.isSelected, 'yyyy-MM-dd'),
        isSunday: isSunday(addDays(firstDay, i)),
        isSameMonth: isSameMonth(this.fullDate, addDays(firstDay, i)),
      } as any;
      this.daycells.push(day);
    }
  }

  onToday() {
    this.fullDate = new Date();
    this.popoverCtrl.dismiss({ fullDate: this.fullDate });
  }

  onClose() {
    this.popoverCtrl.dismiss({ fullDate: this.fullDate });
  }

  onPrevMonth() {
    this.fullDate = subMonths(this.fullDate, 1);
    this.populateCellDays();
  }

  onNextMonth() {
    this.fullDate = addMonths(this.fullDate, 1);
    this.populateCellDays();
  }

  onDayClick(day: any) {
    this.fullDate = parse(day.cellDate, 'yyyy-MM-dd', new Date());
    // this.populateCellDays();
    this.popoverCtrl.dismiss({ fullDate: this.fullDate });
  }
}
