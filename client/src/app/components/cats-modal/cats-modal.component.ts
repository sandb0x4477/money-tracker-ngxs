import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CategoryModel } from '../../_common/app.models';
import { Store, Select } from '@ngxs/store';
import { CategoryState } from '../../store';


@Component({
  selector: 'app-cats-modal',
  templateUrl: './cats-modal.component.html',
  styleUrls: ['./cats-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatsModalComponent implements OnInit, OnDestroy {
  @Input() type = 1;

  @Select(CategoryState.catsIncome) catsIncome$: Observable<CategoryModel[]>;
  @Select(CategoryState.catsExpense) catsExpense$: Observable<CategoryModel[]>;
  @Select(CategoryState.subCats) subCats$: Observable<CategoryModel[]>;

  subscription: Subscription;
  expenseCats: CategoryModel[] = [];
  incomeCats: CategoryModel[] = [];
  subCats: CategoryModel[] = [];
  filteredSubCats: CategoryModel[] = [];
  activeItem = 0;

  cats: CategoryModel[];

  selectedItemId = 0;

  constructor(
    private modalCtrl: ModalController,
    public store: Store,
  ) {}

  ngOnInit() {
    this.subscription = combineLatest([
      this.catsExpense$,
      this.catsIncome$,
      this.subCats$,
    ])
      .pipe(
        tap(([catsExpense, catsIncome, subCats]) => {
          this.cats = this.type === 1 ? catsExpense : catsIncome;
          this.expenseCats = catsExpense;
          this.incomeCats = catsIncome;
          this.subCats = subCats;
        }),
      )
      .subscribe();
  }

  onRedirectToCats() {
    this.modalCtrl.dismiss('navigate');
  }

  onModalDismiss() {
    this.modalCtrl.dismiss(null);
  }

  onMainCatClick(item: CategoryModel) {
    this.activeItem = item.id;

    if (this.selectedItemId === item.id) {
      this.onSelection(item);
    } else {
      this.selectedItemId = item.id;
    }

    this.filteredSubCats = this.subCats.filter(s => s.parentId === item.id);
  }

  onSubCatClick(item: CategoryModel) {
    this.onSelection(item);
  }

  onSelection(item: CategoryModel) {
    let payload = {};
    if (item.parentId === null) {
      payload = {
        category: item,
        subCategory: null,
      };
    } else {
      payload = {
        category: this.cats.find(c => c.id === item.parentId),
        subCategory: item,
      };
    }
    this.modalCtrl.dismiss(payload);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
