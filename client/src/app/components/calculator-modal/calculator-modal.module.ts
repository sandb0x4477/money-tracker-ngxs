import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalculatorModalComponent } from './calculator-modal.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,],
  declarations: [CalculatorModalComponent],
  exports: [CalculatorModalComponent]
})
export class CalculatorModalModule {}
