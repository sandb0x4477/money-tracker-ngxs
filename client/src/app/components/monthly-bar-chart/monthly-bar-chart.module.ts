import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MonthlyBarChartComponent } from './monthly-bar-chart.component';


@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule ],
  declarations: [MonthlyBarChartComponent],
  exports: [MonthlyBarChartComponent]
})
export class MonthlyBarChartModule {}
