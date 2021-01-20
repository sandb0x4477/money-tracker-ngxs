import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { IonReorderGroup, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CategoryModel } from '../../../_common/app.models';
import { EditAccCatPage } from '../../../components/edit-acc-cat/edit-acc-cat.page';
import {
  CategoryState,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  REMOVE_CATEGORY,
  REORDER_CATEGORIES,
} from '../../../store';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.page.html',
  styleUrls: ['./subcategory.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubcategoryPage implements OnInit {
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  @Select(CategoryState.categories) categories$: Observable<CategoryModel[]>;

  subCats$: Observable<CategoryModel[]>;
  mainCategory$: Observable<CategoryModel>;
  mainCategory: CategoryModel;
  mainCategoryId: number;
  reorderMode = false;

  constructor(private route: ActivatedRoute, private modalCtrl: ModalController, public store: Store) {}

  ngOnInit() {
    this.mainCategoryId = +this.route.snapshot.params.id;

    this.subCats$ = this.categories$.pipe(
      map(cats => cats.filter(c => c.deleted === false && c.parentId === this.mainCategoryId)),
    );

    this.mainCategory$ = this.categories$.pipe(
      map(cats => cats.find(c => c.id === this.mainCategoryId)),
      tap(cat => (this.mainCategory = cat)),
    );
  }

  switchReorderMode() {
    this.reorderMode = !this.reorderMode;
  }

  addNewInModal() {
    const componentProps = {
      title: 'Add Subcategory',
      flag: 'add',
      type: 'subcategory',
      name: '',
    };
    this.presentModal(componentProps, EditAccCatPage);
  }

  editInModal(item: CategoryModel) {
    const componentProps = {
      title: 'Edit Subcategory',
      flag: 'edit',
      type: 'subcategory',
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
        type: this.mainCategory.type,
        parentId: this.mainCategoryId,
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
