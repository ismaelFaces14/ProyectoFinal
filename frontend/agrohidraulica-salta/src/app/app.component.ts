import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationService } from './core/services/notification.service';
import { ConfirmNotificationComponent } from './components/confirm-notification/confirm-notification.component';
import { ConfirmNotificationService } from './core/services/confirm-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('noti') noti!: NotificationComponent;
  @ViewChild('confirm') confirm!: ConfirmNotificationComponent;

  title = 'agrohidraulica-salta';

  constructor(
    private router: Router,
    private notiService: NotificationService,
    private confirmService: ConfirmNotificationService
  ) { }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  ngAfterViewInit() {
    this.notiService.registrar(this.noti);
    this.confirmService.registrar(this.confirm);
  }


}
