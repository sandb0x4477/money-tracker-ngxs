import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewTransPageRoutingModule } from './new-trans-routing.module';

import { NewTransPage } from './new-trans.page';
import { DatePickerPopupModule } from '../../components/date-picker-popup/date-picker-popup.module';
import { CatsModalModule } from '../../components/cats-modal/cats-modal.module';
import { CalculatorModalModule } from '../../components/calculator-modal/calculator-modal.module';
// import { RepeatModalModule } from '../../components/repeat-modal/repeat-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewTransPageRoutingModule,
    DatePickerPopupModule,
    CatsModalModule,
    CalculatorModalModule,
    // RepeatModalModule,
  ],
  declarations: [NewTransPage],
})
export class NewTransPageModule {}
