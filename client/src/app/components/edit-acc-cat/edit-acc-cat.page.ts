import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, AlertController, IonInput } from '@ionic/angular';

@Component({
  selector: 'app-edit-acc-cat',
  templateUrl: './edit-acc-cat.page.html',
  styleUrls: ['./edit-acc-cat.page.scss'],
})
export class EditAccCatPage implements OnInit {
  @ViewChild('nameInput') nameInput: IonInput;
  @Input() title: string;
  @Input() flag: string;
  @Input() type: string;
  @Input() name: string | null;
  @Input() id: string | null;
  @Input() incomeExpense = 'Expense';

  constructor(private modalCtrl: ModalController, private alertCtlr: AlertController) {}

  ngOnInit() {}

  ionViewDidEnter() {
    setTimeout(() => this.nameInput.setFocus(), 0);
  }

  onSubmit() {
    const data = {
      name: this.name,
      flag: this.flag,
      type: this.type,
      id: this.id || null,
      incomeExpense: this.incomeExpense || null,
    };
    this.dismissModal(data);
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
            this.delete();
          },
        },
      ],
    });

    await alert.present();
  }

  delete() {
    const data = {
      name: this.name,
      flag: 'delete',
      type: this.type,
      id: this.id || null,
    };
    this.dismissModal(data);
  }

  submitDisabled() {
    return this.name.length < 3;
  }

  async dismissModal(data: any = null) {
    await this.modalCtrl.dismiss(data);
  }
}
