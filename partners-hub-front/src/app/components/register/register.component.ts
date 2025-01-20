import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.password.length < 6) {
      this.errorMessage = 'Пароль должен быть длиной не менее 6 символов';
      return;
    }

    this.authService.register(this.username, this.password).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Registration failed', error);

        if (error?.status === 400 && error?.error?.detail === 'Username already registered') {
          this.errorMessage = 'Пользователь с таким именем уже существует';
        } else {
          this.errorMessage = 'Произошла ошибка при регистрации. Попробуйте снова.';
        }
      }
    );
  }

}
