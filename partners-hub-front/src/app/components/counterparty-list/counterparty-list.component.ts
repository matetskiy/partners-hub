import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterpartyService } from '../../services/counterparty.service';
import { AuthService } from '../../services/auth.service';
import { translations, Translations } from '../../translations/translations';

@Component({
  selector: 'app-counterparty-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './counterparty-list.component.html',
  styleUrls: ['./counterparty-list.component.css']
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
          counterparty_type: this.translations.counterpartyType[counterparty.counterparty_type as keyof typeof this.translations.counterpartyType] || counterparty.counterparty_type,
          country: this.translations.country[counterparty.country as keyof typeof this.translations.country] || counterparty.country,
          partnership_rating: this.translations.partnership_rating[counterparty.partnership_rating as keyof typeof this.translations.partnership_rating] || counterparty.partnership_rating
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
        this.counterparties = this.counterparties.filter(counterparty => counterparty.id !== counterpartyId);
      },
      (error) => {
        console.error('Error deleting counterparty', error);
      }
    );
  }

  getRatingClass(rating: string): string {
    switch (rating) {
      case 'Отлично':
        return 'rating-excellent';
      case 'Хорошо':
        return 'rating-good';
      case 'Удовлетворительно':
        return 'rating-average';
      case 'Плохо':
        return 'rating-poor';
      default:
        return '';
    }
  }
}
