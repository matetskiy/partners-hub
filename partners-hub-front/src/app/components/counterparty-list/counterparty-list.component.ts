// src/app/components/counterparty-list/counterparty-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterpartyService } from '../../services/counterparty.service';
import { AuthService } from '../../services/auth.service';
import { translations, Translations } from '../../translations/translations';  // Импортируем правильно

@Component({
  imports: [CommonModule],
  selector: 'app-counterparty-list',
  standalone: true,
  styleUrls: ['./counterparty-list.component.css'],
  templateUrl: './counterparty-list.component.html',
})
export class CounterpartyListComponent implements OnInit {
  counterparties: any[] = [];
  isAdmin: boolean = false;
  translations: Translations = translations;

  constructor(private counterpartyService: CounterpartyService, private authService: AuthService) {}

  ngOnInit() {
    this.loadCounterparties();
    this.isAdmin = this.authService.isAdminUser();
  }

  loadCounterparties() {
    this.counterpartyService.getCounterparties().subscribe(
      (counterparties) => {
        this.counterparties = counterparties.map(counterparty => ({
          ...counterparty,
          counterparty_type: this.translations.counterpartyType[counterparty.counterparty_type as string] || counterparty.counterparty_type,
          country: this.translations.country[counterparty.country as string] || counterparty.country,
          partnership_rating: this.translations.partnership_rating[counterparty.partnership_rating as string] || counterparty.partnership_rating
        }));
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
