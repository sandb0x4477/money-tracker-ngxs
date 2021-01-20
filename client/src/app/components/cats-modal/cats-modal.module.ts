import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { CatsModalComponent } from './cats-modal.component';

@NgModule({
  imports: [ CommonModule,  IonicModule],
  declarations: [CatsModalComponent],
  exports: [CatsModalComponent]
})
export class CatsModalModule {}
