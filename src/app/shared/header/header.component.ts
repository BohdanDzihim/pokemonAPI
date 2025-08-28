import { Component } from '@angular/core';
import { NetworkStatusComponent } from '../network-status/network-status.component';

@Component({
  selector: 'app-header',
  imports: [NetworkStatusComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
