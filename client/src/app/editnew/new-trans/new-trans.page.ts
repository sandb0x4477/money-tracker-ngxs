import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { format } from 'date-fns';
import { Store } from '@ngxs/store';

import { DatePickerPopupComponent } from '../../components/date-picker-popup/date-picker-popup.component';
import { CatsModalComponent } from '../../components/cats-modal/cats-modal.component';
import { CalculatorModalComponent } from '../../components/calculator-modal/calculator-modal.component';
import { UtilityService } from '../../_services/utility.service';
import { TransactionModel, createTransaction } from '../../_common/app.models';
import { REPEAT_TYPES } from '../../_config/repeat.types';
import { ADD_TRANS } from '../../store';

@Component({
  selector: 'app-new-trans',
  templateUrl: './new-trans.page.html',
  styleUrls: ['./new-trans.page.scss'],
})
export class NewTransPage implements OnInit {
  returnUrl: string;
  trans: TransactionModel;
  inSequence = true;
  repeatTypes = REPEAT_TYPES;
  repeat = this.repeatTypes[0];

  constructor(
    private utilityService: UtilityService,
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    public store: Store,
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/app/trans/daily';
    console.log(this.route.snapshot.queryParams.date);
    this.trans = createTransaction();
    if (this.route.snapshot.queryParams.date) {
      this.trans.fullDate = new Date(this.route.snapshot.queryParams.date);
    }
    this.openCategories();
  }

  segmentChanged(ev: any) {
    this.trans.type = +ev.detail.value;
    this.trans.categoryId = null;
    this.trans.subCategoryId = null;
    this.trans.category = null;
    this.trans.subCategory = null;
  }

  // ! DATE PICKER
  async openDatePicker() {
    const datePopover = await this.popoverCtrl.create({
      component: DatePickerPopupComponent,
      componentProps: {
        fullDate: this.trans.fullDate,
      },
      cssClass: 'datepicker-popover',
    });

    await datePopover.present();

    const { data } = await datePopover.onWillDismiss();
    if (data) {
      // console.log('TC: TestPage -> openDatePicker -> data', data);
      this.trans.fullDate = data.fullDate;
      this.trans.shortDate = format(data.fullDate, 'yyyy-MM-dd');
    }
  }

  // ! CATS MODAL
  async openCategories() {
    const componentProps = {
      type: this.trans.type,
    };
    const modal = await this.modalCtrl.create({
      component: CatsModalComponent,
      componentProps,
      cssClass: 'cats-modal',
      showBackdrop: false,
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (!data) {
      this.inSequence = false;
      return;
    }

    if (data === 'navigate') {
      await this.router.navigate(['app/settings/category'], {
        queryParams: { returnUrl: this.router.routerState.snapshot.url },
      });
    } else {
      this.trans.categoryId = data.category.id;
      this.trans.subCategoryId = data.subCategory?.id || null;
      this.trans.category = data.category;
      this.trans.subCategory = data.subCategory;
      if (this.inSequence) {
        this.openCalculator();
      }
    }
  }

  // ! CALCULATOR MODAL
  async openCalculator() {
    const componentProps = {};
    const modal = await this.modalCtrl.create({
      component: CalculatorModalComponent,
      componentProps,
      cssClass: 'calculator-modal',
      showBackdrop: false,
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (!data) {
      return;
    }
    this.trans.amount = data;
  }

  // ! REPEAT MODAL
  async openRepeats() {
    // const componentProps = {};
    // const modal = await this.modalCtrl.create({
    //   component: RepeatModalComponent,
    //   componentProps,
    //   cssClass: 'repeat-modal',
    //   showBackdrop: false,
    // });
    // await modal.present();

    // const { data } = await modal.onWillDismiss();

    // if (!data) {
    //   return;
    // }

    // if (data) {
    //   this.repeat = data;
    // }
  }

  onSubmit() {
    const { fullDate, type, amount, memo, categoryId, subCategoryId } = this.trans;
    const payload: Partial<TransactionModel> = {
      type,
      fullDate,
      shortDate: format(<Date>fullDate, 'yyyy-MM-dd'),
      amount,
      memo,
      categoryId,
      subCategoryId,
    };
    this.store.dispatch(new ADD_TRANS(payload));

    // if (this.repeat.value !== 0) {
    //   const nextDate = this.utilityService.getRepeatNextDate(this.repeat.value, <Date>fullDate);
    //   const payloadRepeat: Partial<RepeatTransModel> = {
    //     type,
    //     amount,
    //     memo,
    //     categoryId,
    //     subCategoryId,
    //     created: format(<Date>fullDate, 'yyyy-MM-dd'),
    //     nextDate: format(<Date>nextDate, 'yyyy-MM-dd'),
    //     repeat: this.repeat.value,
    //   };
    //   console.log('TC: NewTransPage -> onSubmit -> payloadRepeat', payloadRepeat);
    //   this.actionsService.createRepeatTrans(payloadRepeat);
    // }

    this.goBack();
  }

  hasChanged() {
    const { categoryId } = this.trans;
    if (categoryId) {
      return false;
    }
    return true;
  }

  get catFullName() {
    const category = this.trans.category || null;
    const subCategory = this.trans.subCategory || null;
    if (!category && !subCategory) {
      return null;
    }
    return subCategory ? `${category.name}/${subCategory.name}` : `${category.name}`;
  }

  goBack() {
    this.router.navigateByUrl(this.returnUrl, { replaceUrl: true });
  }
}
