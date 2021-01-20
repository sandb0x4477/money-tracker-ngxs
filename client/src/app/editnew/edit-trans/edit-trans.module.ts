import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EditTransPageRoutingModule } from './edit-trans-routing.module';

import { EditTransPage } from './edit-trans.page';
import { DatePickerPopupModule } from '../../components/date-picker-popup/date-picker-popup.module';
import { CatsModalModule } from '../../components/cats-modal/cats-modal.module';
import { CalculatorModalModule } from '../../components/calculator-modal/calculator-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditTransPageRoutingModule,
    DatePickerPopupModule,
    CatsModalModule,
    CalculatorModalModule,
  ],
  declarations: [EditTransPage]
})
export class EditTransPageModule {}
