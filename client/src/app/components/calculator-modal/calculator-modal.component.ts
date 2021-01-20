import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-calculator-modal',
  templateUrl: './calculator-modal.component.html',
  styleUrls: ['./calculator-modal.component.scss'],
})
export class CalculatorModalComponent implements OnInit {
  display = '0';
  operatorFlag = false;
  decimalFlag = false;
  result = 0;
  lastChars = ['+', '-', '/', '*', '%', '.'];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onNumberClick(n: string) {
    switch (n) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        {
          this.display = this.display === '0' ? n : this.display + n;
          this.operatorFlag = false;
        }
        break;

      default:
        break;
    }
  }

  onOperatorClick(op: string) {
    const last = this.display[this.display.length - 1];
    if (this.display === '0') return;

    if (last === '.') return;

    if (!this.operatorFlag) {
      this.display += op;
      this.operatorFlag = true;
      this.decimalFlag = false;
    }
  }

  onDot() {
    if (!this.decimalFlag) {
      this.display += '.';
      this.decimalFlag = true;
    }
  }

  onCalculate() {
    const last = this.display[this.display.length - 1];

    if (this.lastChars.some(c => last.includes(c))) {
       this.display = this.display.length > 1 ? this.display.slice(0, this.display.length - 1) : '0';
    }
    this.display = eval(this.display).toFixed(2);
    this.result = parseFloat(this.display);
  }

  onBackspace() {
    const last = this.display[this.display.length - 1];

    if (last === '.') {
      this.decimalFlag = false;
    }

    if (this.lastChars.some(c => last.includes(c))) {
      this.operatorFlag = false;
    }

    this.display = this.display.length > 1 ? this.display.slice(0, this.display.length - 1) : '0';
  }

  onClear() {
    this.display = '0';
    this.decimalFlag = false;
    this.operatorFlag = false;
  }

  onDone() {
    this.onCalculate();
    this.modalCtrl.dismiss(this.result);
  }
}
