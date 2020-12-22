import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonReorderGroup, ModalController } from '@ionic/angular';

import { CategoryModel } from '../../_common/app.models';
import { EditAccCatPage } from '../../components/edit-acc-cat/edit-acc-cat.page';
import { Store, Select } from '@ngxs/store';
import { CategoryState, ADD_CATEGORY, UPDATE_CATEGORY, REMOVE_CATEGORY, REORDER_CATEGORIES } from '../../store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPage implements OnInit {
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  @Select(CategoryState.catsIncome) catsIncome$: Observable<CategoryModel[]>;
  @Select(CategoryState.catsExpense) catsExpense$: Observable<CategoryModel[]>;

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
      title: 'Add Category',
      flag: 'add',
      type: 'category',
      name: '',
    };
    this.presentModal(componentProps, EditAccCatPage);
  }

  editInModal(item: CategoryModel) {
    const componentProps = {
      title: 'Edit Category',
      flag: 'edit',
      type: 'category',
      name: item.name,
      id: item.id,
    };
    this.presentModal(componentProps, EditAccCatPage);
  }

  async presentModal(componentProps: any, component: any) {
    const modal = await this.modalCtrl.create({
      component,
      componentProps,
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (!data) {
      return;
    }

    if (data.flag === 'add') {
      const payload: Partial<CategoryModel> = {
        name: data.name,
        type: data.incomeExpense === 'Expense' ? 1 : 0,
        parentId: null,
      };
      this.store.dispatch(new ADD_CATEGORY(payload));
    } else if (data.flag === 'edit') {
      const payload: Partial<CategoryModel> = {
        id: data.id,
        name: data.name,
      };
      this.store.dispatch(new UPDATE_CATEGORY(payload));
    } else if (data.flag === 'delete') {
      this.store.dispatch(new REMOVE_CATEGORY(data.id));
    }
  }

  /* ---------------------------- REORDER --------------------------- */
  doReorder({ detail }: any, data: CategoryModel[]) {
    let moveTo: number;
    let moveFrom = data[detail.from].sequence;
    if (detail.to === data.length) {
      moveTo = data[detail.to - 1].sequence;
    } else {
      moveTo = data[detail.to].sequence;
    }
    detail.complete();
    this.store.dispatch(new REORDER_CATEGORIES({ moveFrom, moveTo }));
  }
}
