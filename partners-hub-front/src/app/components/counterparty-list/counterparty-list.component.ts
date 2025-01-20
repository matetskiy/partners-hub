import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterpartyService } from '../../services/counterparty.service';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [CommonModule],
  selector: 'app-counterparty-list',
  standalone: true,
  styleUrls: ['./counterparty-list.component.css'],
  templateUrl: './counterparty-list.component.html',
})
export class CounterpartyListComponent implements OnInit {
  counterparties: any[] = [];  // Переменная для хранения списка контрагентов
  isAdmin: boolean = false;

  constructor(private counterpartyService: CounterpartyService, private authService: AuthService) {}

  ngOnInit() {
    this.loadCounterparties();
    this.isAdmin = this.authService.isAdminUser(); // Проверяем, является ли пользователь администратором
  }

  loadCounterparties() {
    this.counterpartyService.getCounterparties().subscribe(
      (counterparties) => {
        this.counterparties = counterparties;
      },
      (error) => {
        this.counterparties = [];
        console.error('Error loading counterparties', error);
      }
    );
  }

  deleteCounterparty(counterpartyId: number) {
    this.counterpartyService.deleteCounterparty(counterpartyId).subscribe(
      () => {
        // Удаляем контрагента из локального списка
        this.counterparties = this.counterparties.filter(counterparty => counterparty.id !== counterpartyId);
      },
      (error) => {
        console.error('Error deleting counterparty', error);
      }
    );
  }
}
