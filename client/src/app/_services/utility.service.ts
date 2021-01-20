import { Injectable } from '@angular/core';
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
  getDate,
  isToday,
  isSunday,
  isSameWeek,
  isSameMonth,
  addMonths,
  addWeeks,
  parseISO,
  isWithinInterval
} from 'date-fns';

import { CategoryModel, QueryModel, Period, TransactionModel } from '../_common/app.models';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  queryFormat = 'yyyy-MM-dd';

  constructor() {}

  checkForUpdate(transDate: string, dateDaily: Date, prevDate: Date = null) {
    const date = parseISO(transDate);
    if (isSameMonth(date, dateDaily) || isSameMonth(prevDate, dateDaily)) {
      console.log('TC: checkForUpdate -> daily true');
      return true;
    } else {
      console.log('TC: checkForUpdate -> daily false');
      return false;
    }
  }

  getQuery(date: Date, statsPeriod: Period = Period.MONTHLY, catsLastTwelve: boolean = false): QueryModel {
    const query: any = {};
    if (statsPeriod === Period.YEARLY) {
      query.start = format(startOfYear(date), this.queryFormat);
      query.end = format(endOfYear(date), this.queryFormat);
    } else if (catsLastTwelve) {
      query.start = format(subMonths(startOfMonth(date), 11), this.queryFormat);
      query.end = format(endOfMonth(date), this.queryFormat);
    } else {
      query.start = format(startOfMonth(date), this.queryFormat);
      query.end = format(endOfMonth(date), this.queryFormat);
    }
    return query;
  }

  getQueryFortyTwoDays(date: Date): QueryModel {
    return {
      start: format(startOfWeek(startOfMonth(date), { weekStartsOn: 1 }), this.queryFormat),
      end: format(addDays(startOfWeek(startOfMonth(date), { weekStartsOn: 1 }), 41), this.queryFormat),
    };
  }

  processDailyData(trans: TransactionModel[], date: Date, period: Period = Period.MONTHLY) {
    let dailyData = [];
    let totalIncome = 0;
    let totalExpense = 0;
    const shortDateOfMonth: string[] = this.getShortDates(date, period);
    shortDateOfMonth.forEach(sd => {
      const result = trans.filter(t => t.shortDate === sd);
      if (result.length) {
        const data = this.getDayHeader(result);
        totalExpense += data.expense;
        totalIncome += data.income;
        dailyData.push({ header: data.payload, result });
      }
    });
    return { dailyData, totalIncome, totalExpense };
  }

  getDayHeader(day: TransactionModel[]) {
    let income = 0;
    let expense = 0;
    let dayOfTheMonth: string;
    let monthYear: string;
    let weekDay: string;
    day.forEach(item => {
      if (item.type === 0) {
        income += item.amount;
      } else {
        expense += item.amount;
      }
    });
    dayOfTheMonth = format(new Date(day[0].fullDate), 'd');
    monthYear = format(new Date(day[0].fullDate), 'yyyy.MM');
    weekDay = format(new Date(day[0].fullDate), 'EEEE');
    const payload = {
      income,
      expense,
      dayOfTheMonth,
      monthYear,
      weekDay,
    };
    return { payload, expense, income };
  }

  getShortDates(date: Date, period: Period = Period.MONTHLY): string[] {
    let shortDates: string[];
    if (period === Period.YEARLY) {
      shortDates = eachDayOfInterval({
        start: startOfYear(date),
        end: endOfYear(date),
      })
        .map(item => format(item, this.queryFormat))
        .reverse();
    } else {
      shortDates = eachDayOfInterval({
        start: startOfMonth(date),
        end: endOfMonth(date),
      })
        .map(item => format(item, this.queryFormat))
        .reverse();
    }
    return shortDates;
  }

  catFullName(mainCatName: CategoryModel, subCatName: CategoryModel | null) {
    if (!mainCatName && !subCatName) {
      return null;
    }
    return subCatName ? `${mainCatName.name}/${subCatName.name}` : `${mainCatName.name}`;
  }
}
