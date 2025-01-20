import { Component, OnInit } from '@angular/core';
import { CounterpartyService } from '../../services/counterparty.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-counterparty',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-counterparty.component.html',
  styleUrls: ['./add-counterparty.component.css']
})
export class AddCounterpartyComponent implements OnInit {
  counterparty = {
    name: '',
    phone: '',
    email: '',
    country: '',
    address: '',
    partnership_rating: 'Good',
    counterparty_type: 'Legal',
    tax_number: '',
    bank_account: '',
    image: ''
  };

  constructor(
    private counterpartyService: CounterpartyService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Проверяем, является ли текущий пользователь администратором
    if (!this.authService.isAdminUser()) {
      this.router.navigate(['/counterparties']);
    }
  }

  onSubmit() {
    // Отправляем данные контрагента на сервер
    this.counterpartyService.addCounterparty(this.counterparty).subscribe(
      () => {
        this.router.navigate(['/counterparties']);
      },
      error => {
        console.error('Ошибка при добавлении контрагента', error);
      }
    );
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Image = e.target.result.split(',')[1];
        this.counterparty.image = base64Image;
      };
      reader.readAsDataURL(file);
    }
  }
}
