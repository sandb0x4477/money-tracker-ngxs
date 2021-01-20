import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { addMonths, subMonths, addYears, subYears } from 'date-fns';

import { SET_DATE_TRANS, TransState } from '../store';
import { CalMonthSelComponent } from '../components/cal-month-sel/cal-month-sel.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
  @Select(TransState.allDates) allDates$: Observable<any>;

  menuValue = 'daily';
  constructor(private router: Router, private popoverCtrl: PopoverController, public store: Store) {}

  ngOnInit() {
    this.router.navigate(['app/trans/daily']).then(() => {});
  }

  doRefresh(ev: any) {
    ev.target.complete();
    // this.actionsService.initStore();
  }

  segmentChanged({ detail }: any) {
    this.router
      .navigate(['app/trans/', detail.value])
      .then(() => {
        this.menuValue = detail.value;
      })
      .catch(err => console.log(err));
  }

  async presentPopover(event: any, date: Date) {
    const popover = await this.popoverCtrl.create({
      component: CalMonthSelComponent,
      event,
      componentProps: {
        selectedDate: date,
      },
      cssClass: 'cal-month-sel',
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      switch (this.menuValue) {
        case 'daily':
          this.setNewDate(data, 'dateTrans');
          break;
        case 'calendar':
          this.setNewDate(data, 'dateTrans');
          break;
        case 'budget':
          this.setNewDate(data, 'dateBudget');
          break;
      }
    }
  }

  next(dates: any) {
    const { dateTrans, dateMonthly, dateBudget } = dates;
    switch (this.menuValue) {
      case 'daily':
        this.setNewDate(addMonths(dateTrans, 1), 'dateTrans');
        break;

      case 'calendar':
        this.setNewDate(addMonths(dateTrans, 1), 'dateTrans');
        break;

      case 'monthly':
        this.setNewDate(addYears(dateMonthly, 1), 'dateMonthly');
        break;

      case 'budget':
        this.setNewDate(addMonths(dateBudget, 1), 'dateBudget');
        break;
    }
  }

  prev(dates: any) {
    const { dateTrans, dateMonthly, dateBudget } = dates;
    switch (this.menuValue) {
      case 'daily':
        this.setNewDate(subMonths(dateTrans, 1), 'dateTrans');
        break;

      case 'calendar':
        this.setNewDate(subMonths(dateTrans, 1), 'dateTrans');
        break;

      case 'monthly':
        this.setNewDate(subYears(dateMonthly, 1), 'dateMonthly');
        break;

      case 'budget':
        this.setNewDate(subMonths(dateBudget, 1), 'dateBudget');
        break;
    }
  }

  setNewDate(date: Date, type: string) {
    this.store.dispatch(new SET_DATE_TRANS({ date, type }));
  }
}
