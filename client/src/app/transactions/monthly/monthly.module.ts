import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MonthlyPageRoutingModule } from './monthly-routing.module';

import { MonthlyPage } from './monthly.page';
import { MonthlyBarChartModule } from '../../components/monthly-bar-chart/monthly-bar-chart.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MonthlyPageRoutingModule,
    MonthlyBarChartModule
  ],
  declarations: [MonthlyPage]
})
export class MonthlyPageModule {}
