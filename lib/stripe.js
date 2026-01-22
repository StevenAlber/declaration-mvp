import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const TIERS = {
  witness: {
    name: 'Witness',
    nameRu: 'Свидетель',
    amount: 100,
    priceId: process.env.STRIPE_PRICE_WITNESS,
    description: 'Permanent registry entry + Digital certificate',
    descriptionRu: 'Постоянная запись в реестре + Цифровой сертификат',
    category: 'symbolic'
  },
  steward: {
    name: 'Steward',
    nameRu: 'Хранитель',
    amount: 500,
    priceId: process.env.STRIPE_PRICE_STEWARD,
    description: 'All Witness benefits + Quarterly Continuity Brief',
    descriptionRu: 'Все преимущества Свидетеля + Ежеквартальный бюллетень',
    category: 'symbolic'
  },
  guardian: {
    name: 'Guardian',
    nameRu: 'Страж',
    amount: 5000,
    priceId: process.env.STRIPE_PRICE_GUARDIAN,
    description: 'All Steward benefits + Annual summit invitation + Founders Council voice',
    descriptionRu: 'Все преимущества Хранителя + Приглашение на саммит + Голос в Совете основателей',
    category: 'symbolic'
  },
  settler: {
    name: 'Settler',
    nameRu: 'Поселенец',
    amount: 50000,
    priceId: process.env.STRIPE_PRICE_SETTLER,
    description: 'Land reservation in bio-eco-village + Family relocation support + All Guardian benefits',
    descriptionRu: 'Резервирование земли в биоэкопоселении + Поддержка переезда семьи + Все преимущества Стража',
    category: 'land'
  },
  landholder: {
    name: 'Landholder',
    nameRu: 'Землевладелец',
    amount: 100000,
    priceId: process.env.STRIPE_PRICE_LANDHOLDER,
    description: 'Confirmed land plot (1+ hectare) + Home construction coordination + Permanent residency support',
    descriptionRu: 'Подтверждённый земельный участок (1+ га) + Координация строительства дома + Поддержка ПМЖ',
    category: 'land'
  },
  villagefounder: {
    name: 'Village Founder',
    nameRu: 'Основатель поселения',
    amount: 500000,
    priceId: process.env.STRIPE_PRICE_VILLAGEFOUNDER,
    description: 'Named village section + Multiple family plots + Founding Council seat + Legacy naming rights',
    descriptionRu: 'Именной участок поселения + Участки для нескольких семей + Место в Совете основателей + Право именования',
    category: 'land'
  }
};

export function getTierByPriceId(priceId) {
  for (const [key, tier] of Object.entries(TIERS)) {
    if (tier.priceId === priceId) {
      return { key, ...tier };
    }
  }
  return null;
}
