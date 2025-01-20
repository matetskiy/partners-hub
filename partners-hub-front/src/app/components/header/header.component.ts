import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public authService: AuthService) {
    this.authService.isAdmin.subscribe(isAdmin => {
      console.log('Admin status changed:', isAdmin);
    });
  }

  logout() {
    this.authService.logout();
  }

  isAdmin(): boolean {
    const isAdmin = this.authService.isAdminUser();
    return isAdmin;
  }
}
