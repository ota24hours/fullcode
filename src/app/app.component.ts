import { Component } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart } from '@angular/router';
import { CommonService } from './shared/common/common.service';
import { url } from './shared/models/models';
import { setTheme } from 'ngx-bootstrap/utils';
import { event } from 'jquery';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'SmartHR';
  base = '';
  page = '';
  last = '';
  constructor(
    private common: CommonService,
    private router: Router,
  ) {
    setTheme('bs5');
    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.last.subscribe((res: string) => {
      this.last = res;
    });
    this.router.events.subscribe((data: RouterEvent) => {
      if (data instanceof NavigationStart) {
        this.getRoutes(data);
      }
    });
  }
  // public getRoutes(events: url) {
  //   const splitVal = events.url.split('/');
  //   this.common.base.next(splitVal[1]);
  //   this.common.page.next(splitVal[2]);
  //   this.common.last.next(splitVal[3]);
  // }

  public getRoutes(events: { url: string }) {
    const splitVal = events.url.split('?')[0].split('/');
  
    this.common.base.next(splitVal[1]);
    this.common.page.next(splitVal[2]);
    this.common.last.next(splitVal[3]);
  
    // Extract query params from URL manually
    const queryParamsString = events.url.split('?')[1];
    const queryParams = new URLSearchParams(queryParamsString);
    const mainCat = queryParams.get('mainCat');
  
    this.common.navLocation.next(mainCat || '');
  }
  

}
