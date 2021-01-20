import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, PopoverController, AlertController } from '@ionic/angular';
import { Store, Select } from '@ngxs/store';
import { format } from 'date-fns';
import { Subscription, Observable } from 'rxjs';
import _isEqual from 'lodash.isequal';

import { DatePickerPopupComponent } from '../../components/date-picker-popup/date-picker-popup.component';
import { CatsModalComponent } from '../../components/cats-modal/cats-modal.component';
import { CalculatorModalComponent } from '../../components/calculator-modal/calculator-modal.component';
import { TransactionModel } from '../../_common/app.models';
import { TransState, DELETE_TRANS, UPDATE_TRANS } from '../../store';

@Component({
  selector: 'app-edit-trans',
  templateUrl: './edit-trans.page.html',
  styleUrls: ['./edit-trans.page.scss'],
})
export class EditTransPage implements OnInit {
  @Select(TransState.activeTrans) activeTrans$: Observable<TransactionModel>;
  subscription: Subscription;
  returnUrl: string;
  trans: TransactionModel;
  transOrg: TransactionModel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private alertCtlr: AlertController,
    public store: Store,
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/app/trans/daily';
    this.subscription = this.activeTrans$.subscribe(res => {
      this.trans = { ...res };
      this.transOrg = res;
    });
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
      showBackdrop: true,
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (!data) {
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
    }
  }

  async openCalculator() {
    const componentProps = {};
    const modal = await this.modalCtrl.create({
      component: CalculatorModalComponent,
      componentProps,
      cssClass: 'calculator-modal',
      showBackdrop: true,
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (!data) {
      return;
    }
    this.trans.amount = data;
  }

  onSubmit() {
    const { id, fullDate, amount, memo, categoryId, subCategoryId, type } = this.trans;
    const payload: Partial<TransactionModel> = {
      id,
      type,
      fullDate,
      shortDate: format(fullDate as Date, 'yyyy-MM-dd'),
      amount,
      memo,
      categoryId,
      subCategoryId,
    };
    this.store.dispatch(new UPDATE_TRANS(payload));
    // this.actionsService.updateTransaction(payload, this.transOrg);
    this.goBack();
  }

  goBack() {
    this.router.navigateByUrl(this.returnUrl, { replaceUrl: true });
  }

  onDelete() {
    this.store.dispatch(new DELETE_TRANS(this.trans.id));
    this.goBack();
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtlr.create({
      header: 'Are you sure?',
      message: 'It will be <strong>permanently</strong> deleted!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'primary',
          handler: blah => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.onDelete();
          },
        },
      ],
    });

    await alert.present();
  }

  hasChanged() {
    return _isEqual(this.trans, this.transOrg);
  }

  get catFullName() {
    const category = this.trans.category || null;
    const subCategory = this.trans.subCategory || null;
    if (!category && !subCategory) {
      return null;
    }
    return subCategory ? `${category.name}/${subCategory.name}` : `${category.name}`;
  }

  ionViewWillLeave() {
    console.log('TC: EditTransPage -> ionViewWillLeave -> ionViewWillLeave');
    this.subscription.unsubscribe();
  }
}
