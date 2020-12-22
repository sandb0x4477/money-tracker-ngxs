import { Component, OnInit } from '@angular/core';
// import { SwPush } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// import { AuthService } from '../_services/auth.service';
// import { ActionsService } from '../_services/actions.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  notification$: Observable<PushSubscription>;
  checked: boolean;
  subscription: PushSubscription;

  constructor(
    // private authService: AuthService,
    // public swPush: SwPush,
    // private actionsService: ActionsService,
  ) {}

  ngOnInit() {
    // this.notification$ = this.swPush.subscription.pipe(
    //   tap(sub => {
    //     this.checked = sub ? true : false;
    //     this.subscription = sub;
    //   }),
    // );
  }

  onNotificationChange({ detail }: any) {
    if (detail.checked) {
      // this.actionsService.postSubscribe('subscribe', this.subscription);
    } else {
      // this.actionsService.postSubscribe('unsubscribe', this.subscription);
    }
  }

  logout() {
    // this.authService.logout();
  }

  reload() {
    window.location.reload();
  }
}
