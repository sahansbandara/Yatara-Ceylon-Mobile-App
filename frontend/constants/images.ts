import type { ImageSourcePropType } from 'react-native';

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

export const DestinationImages: Record<string, ImageSourcePropType> = {
  anuradhapura: require('@/assets/districts/anuradhapura.webp'),
  'arugam-bay': require('@/assets/districts/arugam-bay.webp'),
  batticaloa: require('@/assets/districts/batticaloa.webp'),
  colombo: require('@/assets/districts/colombo.webp'),
  ella: require('@/assets/districts/ella.webp'),
  galle: require('@/assets/districts/galle.webp'),
  jaffna: require('@/assets/districts/jaffna.webp'),
  kalpitiya: require('@/assets/districts/kalpitiya.webp'),
  kalutara: require('@/assets/districts/kalutara.webp'),
  kandy: require('@/assets/districts/kandy.webp'),
  kegalle: require('@/assets/districts/kegalle.webp'),
  kurunegala: require('@/assets/districts/kurunegala.webp'),
  mannar: require('@/assets/districts/mannar.webp'),
  mirissa: require('@/assets/districts/mirissa.webp'),
  moneragala: require('@/assets/districts/moneragala.webp'),
  negombo: require('@/assets/districts/negombo.webp'),
  'nuwara-eliya': require('@/assets/districts/nuwara-eliya.webp'),
  polonnaruwa: require('@/assets/districts/polonnaruwa.webp'),
  ratnapura: require('@/assets/districts/ratnapura.webp'),
  sigiriya: require('@/assets/districts/sigiriya.webp'),
  trincomalee: require('@/assets/districts/trincomalee.webp'),
  vavuniya: require('@/assets/districts/vavuniya.webp'),
  yala: require('@/assets/districts/yala.webp'),
};

export const PackageImages: Record<string, ImageSourcePropType> = {
  'adventure-and-highlands': require('@/assets/packages/adventure-and-highlands/hero.webp'),
  'ayurveda-wellness-sanctuary': require('@/assets/packages/ayurveda-wellness-sanctuary-hero.webp'),
  'ceylon-grand-circuit': require('@/assets/packages/ceylon-grand-circuit-hero.png'),
  'colombo-city-coastal-weekend': require('@/assets/packages/colombo-city-coastal-weekend-hero.webp'),
  'cultural-triangle-express': require('@/assets/packages/cultural-triangle-express-hero.webp'),
  'deep-dive-into-the-wild': require('@/assets/packages/deep-dive-into-the-wild-hero.webp'),
  'east-coast-marine-days': require('@/assets/packages/east-coast-marine-days-hero.webp'),
  'east-coast-summer-escape': require('@/assets/packages/east-coast-summer-escape-hero.webp'),
  'east-coast-surf-and-sun': require('@/assets/packages/east-coast-surf-and-sun/hero.webp'),
  'family-escape-in-paradise': require('@/assets/packages/family-escape-in-paradise-hero.webp'),
  'heritage-triangle-private-edition': require('@/assets/packages/heritage-triangle-private-edition-hero.webp'),
  'hill-country-tea-rail-retreat': require('@/assets/packages/hill-country-tea-rail-retreat-hero.png'),
  'honeymoon-private-villa-experiences': require('@/assets/packages/honeymoon-private-villa-experiences-hero.webp'),
  'luxe-rail-villa-journey': require('@/assets/packages/luxe-rail-villa-journey-hero.webp'),
  'luxury-sri-lanka-in-10-days': require('@/assets/packages/luxury-sri-lanka-in-10-days-hero.webp'),
  'photographers-golden-hours': require('@/assets/packages/photographers-golden-hours-hero.webp'),
  'quick-escape-to-the-hills': require('@/assets/packages/quick-escape-to-the-hills-hero.webp'),
  'ramayana-trail': require('@/assets/packages/ramayana-trail-deluxe-hero.webp'),
  'ramayana-trail-deluxe': require('@/assets/packages/ramayana-trail-deluxe-hero.webp'),
  'tea-trails-waterfalls': require('@/assets/packages/tea-trails-waterfalls-hero.webp'),
  'wellness-reset-ayurveda-lite': require('@/assets/packages/wellness-reset-ayurveda-lite-hero.webp'),
  'whale-coast-galle-fort': require('@/assets/packages/whale-coast-galle-fort-hero.webp'),
  'wildlife-coastal-luxe': require('@/assets/packages/wildlife-coastal-luxe-hero.webp'),
};

export const VehicleImages: Record<string, ImageSourcePropType> = {
  'city-sedan': require('@/assets/vehicles/city-sedan.png'),
  'city-suv': require('@/assets/vehicles/city-suv.png'),
  'classic-car': require('@/assets/vehicles/classic-car.png'),
  'executive-sedan': require('@/assets/vehicles/executive-sedan.png'),
  'executive-van': require('@/assets/vehicles/executive-van.png'),
  'luxury-suv': require('@/assets/vehicles/luxury-suv.png'),
  'mini-coach': require('@/assets/vehicles/mini-coach.png'),
  'premium-van': require('@/assets/vehicles/premium-van.png'),
  'ultra-suv': require('@/assets/vehicles/ultra-suv.png'),
};

function slugify(value?: string) {
  return (value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getPackageImage(item: { title?: string; slug?: string; style?: string; images?: string[] }): ImageSourcePropType {
  const slug = item.slug || slugify(item.title);
  const local = PackageImages[slug];
  if (local) return local;

  const style = slugify(item.style);
  const styleFallbacks: Record<string, ImageSourcePropType> = {
    adventure: PackageImages['adventure-and-highlands'],
    beach: PackageImages['whale-coast-galle-fort'],
    cultural: PackageImages['cultural-triangle-express'],
    heritage: PackageImages['heritage-triangle-private-edition'],
    hillcountry: PackageImages['hill-country-tea-rail-retreat'],
    luxury: PackageImages['luxury-sri-lanka-in-10-days'],
    marine: PackageImages['east-coast-marine-days'],
    wellness: PackageImages['ayurveda-wellness-sanctuary'],
    wildlife: PackageImages['wildlife-coastal-luxe'],
  };
  return styleFallbacks[style] || (item.images?.[0] ? { uri: item.images[0] } : HeroImages.dawn);
}

export function getDestinationImage(item: { title?: string; slug?: string; images?: string[] }): ImageSourcePropType {
  const local = DestinationImages[item.slug || slugify(item.title)];
  return local || (item.images?.[0] ? { uri: item.images[0] } : HeroImages.dawn);
}

export function getVehicleImage(item: { type?: string; model?: string; images?: string[] }): ImageSourcePropType {
  const model = slugify(item.model);
  if (model.includes('hiace') || model.includes('van')) return VehicleImages['premium-van'];
  if (model.includes('coach') || model.includes('bus')) return VehicleImages['mini-coach'];
  if (model.includes('land-cruiser') || model.includes('prado') || model.includes('suv')) return VehicleImages['luxury-suv'];
  if (model.includes('sedan') || model.includes('camry') || model.includes('premio')) return VehicleImages['executive-sedan'];

  const type = slugify(item.type);
  const typeFallbacks: Record<string, ImageSourcePropType> = {
    bus: VehicleImages['mini-coach'],
    luxury: VehicleImages['ultra-suv'],
    sedan: VehicleImages['city-sedan'],
    suv: VehicleImages['city-suv'],
    van: VehicleImages['executive-van'],
  };
  return typeFallbacks[type] || (item.images?.[0] ? { uri: item.images[0] } : VehicleImages['city-sedan']);
}

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
