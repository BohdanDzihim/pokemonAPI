import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-network-status',
  standalone: true,
  imports: [],
  templateUrl: './network-status.component.html',
  styleUrl: './network-status.component.scss'
})
export class NetworkStatusComponent implements OnInit {
  signalBars = 0;

  ngOnInit(): void {
    this.updateSignalStrength();

    window.addEventListener('online', () => this.updateSignalStrength());
    window.addEventListener('offline', () => this.signalBars = 0);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', () => this.updateSignalStrength());
    }
  }

  updateSignalStrength(): void {
    const conn = (navigator as any).connection;
    
    if (!navigator.onLine) {
      this.signalBars = 0;
      return;
    }

    if (conn?.downlink) {
      const speed = conn.downlink;

      if (speed >= 10) this.signalBars = 4;
      else if (speed >= 5) this.signalBars = 3;
      else if (speed >= 1) this.signalBars = 2;
      else this.signalBars = 1;
    } else {
      this.signalBars = 4;
    }
  }
}
