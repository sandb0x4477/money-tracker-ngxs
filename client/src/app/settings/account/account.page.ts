import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonReorderGroup, ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AccountModel } from '../../_common/app.models';
import { AccountState, ADD_ACCOUNT, UPDATE_ACCOUNT, REMOVE_ACCOUNT, REORDER_ACCOUNTS } from '../../store';
import { EditAccCatPage } from '../../components/edit-acc-cat/edit-acc-cat.page';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPage implements OnInit {
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  @Select(AccountState.accounts) accounts$: Observable<AccountModel[]>;

  reorderMode = false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private store: Store,
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/app/settings';
  }

  goBack() {
    this.router.navigateByUrl(this.returnUrl, { replaceUrl: true });
  }

  switchReorderMode() {
    this.reorderMode = !this.reorderMode;
  }

  addNewInModal() {
    const componentProps = {
      title: 'Add Account',
      flag: 'add',
      type: 'account',
      name: '',
    };
    this.presentModal(componentProps, EditAccCatPage);
  }

  editInModal(item: AccountModel) {
    const componentProps = {
      title: 'Edit Account',
      flag: 'edit',
      type: 'account',
      name: item.name,
      id: item.id,
    };
    this.presentModal(componentProps, EditAccCatPage);
  }

  async presentModal(componentProps: any, component: any) {
    const modal = await this.modalCtrl.create({
      component,
      componentProps,
      cssClass: 'edit-acc-cat-modal',
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (!data) {
      return;
    }

    if (data.flag === 'add') {
      const payload: Partial<AccountModel> = {
        name: data.name,
      };
      this.store.dispatch(new ADD_ACCOUNT(payload));
    } else if (data.flag === 'edit') {
      const payload: Partial<AccountModel> = {
        id: data.id,
        name: data.name,
      };
      this.store.dispatch(new UPDATE_ACCOUNT(payload));
    } else if (data.flag === 'delete') {
      this.store.dispatch(new REMOVE_ACCOUNT(data.id));
    }
  }

  /* ---------------------------- REORDER --------------------------- */
  doReorder({ detail }: any, data: AccountModel[]) {
    let moveTo: number;

    const moveFrom = data[detail.from].sequence;

    if (detail.to === data.length) {
      moveTo = data[detail.to - 1].sequence;
    } else {
      moveTo = data[detail.to].sequence;
    }
    detail.complete();
    this.store.dispatch(new REORDER_ACCOUNTS({ moveFrom, moveTo }));
  }
}
