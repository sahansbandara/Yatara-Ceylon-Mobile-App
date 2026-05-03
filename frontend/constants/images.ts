/* Bundled image assets — sourced from the Yatara Ceylon website */

export const HeroImages = {
  dawn: require('@/assets/images/heroes/journey-dawn.webp'),
  dusk: require('@/assets/images/heroes/journey-dusk.webp'),
  backdrop: require('@/assets/images/heroes/cta-backdrop.webp'),
  howItWorks: require('@/assets/images/heroes/how-it-works-bg.webp'),
  sustainability: require('@/assets/images/heroes/sustainability-hero.webp'),
};

export const CategoryImages = {
  heritage: require('@/assets/images/categories/cat-heritage.webp'),
  wildlife: require('@/assets/images/categories/cat-wildlife.webp'),
  honeymoon: require('@/assets/images/categories/cat-honeymoon.webp'),
  ayurveda: require('@/assets/images/categories/cat-ayurvedic.webp'),
  hillCountry: require('@/assets/images/categories/cat-hillcountry.webp'),
  coastal: require('@/assets/images/categories/cat-coastal.webp'),
  bespoke: require('@/assets/images/categories/cat-bespoke.webp'),
  ramayana: require('@/assets/images/categories/cat-ramayana.webp'),
  adventure: require('@/assets/images/categories/package-adventure.webp'),
};

export const DestinationImages: Record<string, ReturnType<typeof require>> = {
  colombo: require('@/assets/images/destinations/colombo.png'),
  ella: require('@/assets/images/destinations/ella.png'),
  sigiriya: require('@/assets/images/destinations/sigiriya.png'),
  galle: require('@/assets/images/destinations/galle.png'),
  'nuwara-eliya': require('@/assets/images/destinations/nuwara-eliya.png'),
  yala: require('@/assets/images/destinations/yala.png'),
  trincomalee: require('@/assets/images/destinations/trincomalee.png'),
  anuradhapura: require('@/assets/images/destinations/anuradhapura.png'),
};

/** Tour categories pulled from the website data — used on the home screen */
export const TOUR_CATEGORIES = [
  {
    title: 'Heritage Journeys',
    promise: 'Ancient cities, sacred temples, private guide',
    image: CategoryImages.heritage,
    tags: ['Private Guide', 'Boutique Stays'],
  },
  {
    title: 'Wildlife & Safari',
    promise: 'Leopard country, elephant herds, private jeep',
    image: CategoryImages.wildlife,
    tags: ['Photography', 'Private Jeep'],
  },
  {
    title: 'Honeymoon Escapes',
    promise: 'Private villas, romantic dining, coastal sunsets',
    image: CategoryImages.honeymoon,
    tags: ['Romance', 'Private'],
  },
  {
    title: 'Ayurveda & Wellness',
    promise: 'Guided wellness reset, daily treatments',
    image: CategoryImages.ayurveda,
    tags: ['Slow Travel', 'Spa'],
  },
  {
    title: 'Hill Country & Rail',
    promise: 'Tea bungalows, scenic train, misty highlands',
    image: CategoryImages.hillCountry,
    tags: ['Scenic Rail', 'Couples'],
  },
  {
    title: 'Coastal Serenity',
    promise: 'Secluded beaches, whale watching',
    image: CategoryImages.coastal,
    tags: ['Beach', 'Luxury'],
  },
  {
    title: 'Adventure & Highlands',
    promise: 'Misty peaks, wild rivers, refined escapes',
    image: CategoryImages.adventure,
    tags: ['Adventure', 'Highlands'],
  },
  {
    title: 'Ramayana Trail',
    promise: 'Sacred temples, spiritual heritage',
    image: CategoryImages.ramayana,
    tags: ['Heritage', 'Spiritual'],
  },
  {
    title: 'Bespoke Tour',
    promise: 'Tell us your dates. We build the itinerary.',
    image: CategoryImages.bespoke,
    tags: ['Tailor-Made', 'Concierge'],
  },
];
