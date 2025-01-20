import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CounterpartyService } from "../../services/counterparty.service";
import { AuthService } from "../../services/auth.service";
import { translations, type Translations } from "../../translations/translations";


interface Counterparty {
  id: number
  name: string
  phone: string
  email: string
  country: string
  address: string
  partnership_rating: string
  counterparty_type: string
  tax_number: string
  bank_account: string
  image: string
}

@Component({
  selector: "app-counterparty-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./counterparty-list.component.html",
  styleUrls: ["./counterparty-list.component.css"],
})
export class CounterpartyListComponent implements OnInit {
  counterparties: Counterparty[] = []
  displayedCounterparties: Counterparty[] = []
  isAdmin = false
  translations: Translations = translations
  sortOrder: "asc" | "desc" = "desc"

  constructor(
    private counterpartyService: CounterpartyService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.loadCounterparties()
    this.isAdmin = this.authService.isAdminUser()
  }

  loadCounterparties() {
    this.counterpartyService.getCounterparties().subscribe(
      (counterparties) => {
        this.counterparties = counterparties.map((counterparty) => ({
          ...counterparty,
          counterparty_type:
            this.translations.counterpartyType[
              counterparty.counterparty_type as keyof typeof this.translations.counterpartyType
              ] || counterparty.counterparty_type,
          country:
            this.translations.country[counterparty.country as keyof typeof this.translations.country] ||
            counterparty.country,
          partnership_rating:
            this.translations.partnership_rating[
              counterparty.partnership_rating as keyof typeof this.translations.partnership_rating
              ] || counterparty.partnership_rating,
        }))
        this.sortCounterpartiesByRating()
      },
      (error) => {
        this.counterparties = []
        this.displayedCounterparties = []
        console.error("Error loading counterparties", error)
      },
    )
  }

  deleteCounterparty(counterpartyId: number) {
    this.counterpartyService.deleteCounterparty(counterpartyId).subscribe(
      () => {
        this.counterparties = this.counterparties.filter((counterparty) => counterparty.id !== counterpartyId)
        this.sortCounterpartiesByRating()
      },
      (error) => {
        console.error("Error deleting counterparty", error)
      },
    )
  }

  getRatingClass(rating: string): string {
    switch (rating) {
      case "Отлично":
        return "rating-excellent"
      case "Хорошо":
        return "rating-good"
      case "Удовлетворительно":
        return "rating-average"
      case "Плохо":
        return "rating-poor"
      default:
        return ""
    }
  }

  sortCounterpartiesByRating() {
    const ratingOrder = ["Отлично", "Хорошо", "Удовлетворительно", "Плохо"]
    this.displayedCounterparties = [...this.counterparties].sort((a, b) => {
      const ratingA = ratingOrder.indexOf(a.partnership_rating)
      const ratingB = ratingOrder.indexOf(b.partnership_rating)
      return this.sortOrder === "asc" ? ratingA - ratingB : ratingB - ratingA
    })
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc"
    this.sortCounterpartiesByRating()
  }
}

