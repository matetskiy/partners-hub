// src/app/translations/translations.ts

export interface Translations {
  counterpartyType: {
    [key: string]: string;
  };
  country: {
    [key: string]: string;
  };
  partnership_rating: {
    [key: string]: string;
  };
}

export const translations: Translations = {
  counterpartyType: {
    "Legal": "Юр. лицо",
    "Individual": "Физ. лицо",
    "IP": "ИП"
  },
  country: {
    "Kyrgyzstan": "Кыргызстан",
    "Kazakhstan": "Казахстан",
    "Russia": "Россия",
    "Azerbaijan": "Азербайджан",
    "Belarus": "Беларусь",
    "Armenia": "Армения",
    "Georgia": "Грузия",
    "Moldova": "Молдова",
    "Tajikistan": "Таджикистан",
    "Turkmenistan": "Туркменистан",
    "Uzbekistan": "Узбекистан"
  },
  partnership_rating: {
    "Excellent": "Отлично",
    "Good": "Хорошо",
    "Average": "Удовлетворительно",
    "Bad": "Плохо",
  }

};
