import { Component, OnInit } from '@angular/core';
import { Routerlinks } from 'src/app/app-routing.module';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
})
export class NotFoundComponent implements OnInit {
  quicknavlinks: { route: string; label: string; icon: string }[];

  ngOnInit(): void {

    this.quicknavlinks = [
      {
        route: Routerlinks.home,
        label: 'Home',
        icon: 'assets/icons/globe_rgb_red.svg',
      },
      {
        route: Routerlinks.users,
        label: 'Users',
        icon: 'assets/icons/management_services_rgb_red.svg',
      },
    ];
  }
}
